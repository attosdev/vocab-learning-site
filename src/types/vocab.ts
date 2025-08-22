export interface VocabWord {
  id: number
  word: string
  definition: string
  pronunciation?: string
  partOfSpeech: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  examples: string[]
  synonyms?: string[]
  antonyms?: string[]
}

export interface LearningProgress {
  userId: string
  wordId: number
  correctCount: number
  incorrectCount: number
  lastReviewed: Date
  masteryLevel: number // 0-100
  streakCount: number
}

export interface QuizQuestion {
  id: number
  wordId: number
  type: 'multiple-choice' | 'fill-blank' | 'spelling' | 'definition'
  question: string
  options?: string[]
  correctAnswer: string
  explanation?: string
}

export interface LearningSession {
  id: string
  userId: string
  mode: 'flashcard' | 'quiz' | 'spelling' | 'review'
  wordsStudied: number[]
  startTime: Date
  endTime?: Date
  score?: number
  completedQuestions: number
  correctAnswers: number
}