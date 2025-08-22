import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Word, WordPack } from './supabase'

// Device ID generation
const generateDeviceId = () => {
  if (typeof window === 'undefined') return 'server'
  return localStorage.getItem('deviceId') || 
    (() => {
      const id = crypto.randomUUID()
      localStorage.setItem('deviceId', id)
      return id
    })()
}

// Study session state
export interface StudySession {
  packSlug: string
  words: Word[]
  currentIndex: number
  mode: 'flashcard' | 'quiz' | 'spelling'
  startTime: number
  correctAnswers: number
  totalAnswers: number
  incorrectWords: Word[]
}

// SRS Progress for local storage
export interface SRSProgress {
  wordId: string
  lastSeen: number
  interval: number // days
  ease: number // 1.3 ~ 2.5
  reps: number
  lapses: number
  nextReviewAt: number
}

// Global settings
export interface Settings {
  tts: 'web' | 'audio'
  quizOptionCount: 4
  dailyGoal: 30
  showPhonetic: boolean
  autoPlay: boolean
}

// Main store interface
interface VocabStore {
  // Device & Settings
  deviceId: string
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void

  // Study Session
  currentSession: StudySession | null
  startSession: (pack: WordPack, words: Word[], mode: StudySession['mode']) => void
  nextWord: () => void
  previousWord: () => void
  answerQuestion: (isCorrect: boolean) => void
  endSession: () => StudySession | null

  // Local Progress (SRS)
  srsProgress: Record<string, SRSProgress>
  updateWordProgress: (wordId: string, quality: number) => void
  getWordProgress: (wordId: string) => SRSProgress | null
  getWordsForReview: () => string[]

  // UI State
  isLoading: boolean
  setLoading: (loading: boolean) => void
  showAnswer: boolean
  setShowAnswer: (show: boolean) => void
}

export const useVocabStore = create<VocabStore>()(
  persist(
    (set, get) => ({
      // Initial state
      deviceId: generateDeviceId(),
      settings: {
        tts: 'web',
        quizOptionCount: 4,
        dailyGoal: 30,
        showPhonetic: true,
        autoPlay: false,
      },
      currentSession: null,
      srsProgress: {},
      isLoading: false,
      showAnswer: false,

      // Settings
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Study Session Management
      startSession: (pack, words, mode) => {
        const session: StudySession = {
          packSlug: pack.slug,
          words,
          currentIndex: 0,
          mode,
          startTime: Date.now(),
          correctAnswers: 0,
          totalAnswers: 0,
          incorrectWords: [],
        }
        set({ currentSession: session, showAnswer: false })
      },

      nextWord: () =>
        set((state) => {
          if (!state.currentSession) return state
          const nextIndex = state.currentSession.currentIndex + 1
          return {
            currentSession: {
              ...state.currentSession,
              currentIndex: Math.min(nextIndex, state.currentSession.words.length - 1),
            },
            showAnswer: false,
          }
        }),

      previousWord: () =>
        set((state) => {
          if (!state.currentSession) return state
          const prevIndex = state.currentSession.currentIndex - 1
          return {
            currentSession: {
              ...state.currentSession,
              currentIndex: Math.max(prevIndex, 0),
            },
            showAnswer: false,
          }
        }),

      answerQuestion: (isCorrect) =>
        set((state) => {
          if (!state.currentSession) return state
          const currentWord = state.currentSession.words[state.currentSession.currentIndex]
          const incorrectWords = isCorrect
            ? state.currentSession.incorrectWords
            : [...state.currentSession.incorrectWords, currentWord]

          return {
            currentSession: {
              ...state.currentSession,
              correctAnswers: state.currentSession.correctAnswers + (isCorrect ? 1 : 0),
              totalAnswers: state.currentSession.totalAnswers + 1,
              incorrectWords,
            },
          }
        }),

      endSession: () => {
        const session = get().currentSession
        set({ currentSession: null, showAnswer: false })
        return session
      },

      // SRS Algorithm (simplified SM-2)
      updateWordProgress: (wordId, quality) =>
        set((state) => {
          const existing = state.srsProgress[wordId] || {
            wordId,
            lastSeen: 0,
            interval: 1,
            ease: 2.5,
            reps: 0,
            lapses: 0,
            nextReviewAt: 0,
          }

          let { interval, ease, reps, lapses } = existing

          if (quality < 3) {
            // Incorrect answer
            reps = 0
            lapses += 1
            interval = 1
          } else {
            // Correct answer
            if (reps === 0) {
              interval = 1
            } else if (reps === 1) {
              interval = 3
            } else {
              interval = Math.round(interval * ease)
            }
            reps += 1
          }

          // Update ease factor
          ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

          const now = Date.now()
          const nextReviewAt = now + interval * 24 * 60 * 60 * 1000 // Convert days to milliseconds

          const updated: SRSProgress = {
            wordId,
            lastSeen: now,
            interval,
            ease,
            reps,
            lapses,
            nextReviewAt,
          }

          return {
            srsProgress: {
              ...state.srsProgress,
              [wordId]: updated,
            },
          }
        }),

      getWordProgress: (wordId) => get().srsProgress[wordId] || null,

      getWordsForReview: () => {
        const now = Date.now()
        return Object.values(get().srsProgress)
          .filter((progress) => progress.nextReviewAt <= now)
          .map((progress) => progress.wordId)
      },

      // UI State
      setLoading: (loading) => set({ isLoading: loading }),
      setShowAnswer: (show) => set({ showAnswer: show }),
    }),
    {
      name: 'vocab-store',
      partialize: (state) => ({
        deviceId: state.deviceId,
        settings: state.settings,
        srsProgress: state.srsProgress,
      }),
    }
  )
)