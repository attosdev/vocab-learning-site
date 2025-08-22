'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import StudyCard from '@/components/StudyCard'
import { useVocabStore } from '@/lib/store'
import { fetchWordsByPack, Word } from '@/lib/supabase'
import { SRSManager } from '@/lib/srs'
import {
  ChevronLeft,
  Trophy,
  Target,
  Clock,
  RotateCcw,
  Home,
  BarChart3,
} from 'lucide-react'

export default function StudyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packSlug = searchParams.get('pack')
  const mode = searchParams.get('mode') || 'flashcard'
  
  const {
    currentSession,
    showAnswer,
    setShowAnswer,
    nextWord,
    previousWord,
    answerQuestion,
    endSession,
    updateWordProgress,
  } = useVocabStore()

  const [studyWords, setStudyWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    totalAnswers: 0,
    correctAnswers: 0,
    incorrectWords: [] as Word[],
  })
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initializeStudy() {
      if (!packSlug) {
        router.push('/')
        return
      }

      try {
        const words = await fetchWordsByPack(packSlug, 50)
        if (words.length === 0) {
          alert('단어를 찾을 수 없습니다.')
          router.push('/')
          return
        }

        // Shuffle words for variety
        const shuffledWords = [...words].sort(() => Math.random() - 0.5)
        setStudyWords(shuffledWords)
        setCurrentIndex(0)
        setSessionStats({
          startTime: Date.now(),
          totalAnswers: 0,
          correctAnswers: 0,
          incorrectWords: [],
        })
      } catch (error) {
        console.error('Failed to load study words:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    initializeStudy()
  }, [packSlug, router])

  const currentWord = studyWords[currentIndex]
  const progress = studyWords.length > 0 ? ((currentIndex + 1) / studyWords.length) * 100 : 0

  const handleAnswer = (quality: number) => {
    if (!currentWord) return

    const isCorrect = quality >= 3
    const newStats = {
      ...sessionStats,
      totalAnswers: sessionStats.totalAnswers + 1,
      correctAnswers: sessionStats.correctAnswers + (isCorrect ? 1 : 0),
      incorrectWords: isCorrect 
        ? sessionStats.incorrectWords 
        : [...sessionStats.incorrectWords, currentWord],
    }
    setSessionStats(newStats)

    // Update SRS progress
    updateWordProgress(currentWord.id, quality)

    // Move to next word or complete session
    if (currentIndex < studyWords.length - 1) {
      handleNext()
    } else {
      completeSession(newStats)
    }
  }

  const handleNext = () => {
    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const completeSession = (finalStats: typeof sessionStats) => {
    const duration = Date.now() - finalStats.startTime
    const accuracy = finalStats.totalAnswers > 0 ? (finalStats.correctAnswers / finalStats.totalAnswers) * 100 : 0
    
    setIsSessionComplete(true)
    // Could save session stats to local storage here if needed
  }

  const restartSession = () => {
    setCurrentIndex(0)
    setIsSessionComplete(false)
    setShowAnswer(false)
    setSessionStats({
      startTime: Date.now(),
      totalAnswers: 0,
      correctAnswers: 0,
      incorrectWords: [],
    })
  }

  const getSessionDuration = () => {
    const duration = Date.now() - sessionStats.startTime
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}분 ${seconds}초`
  }

  const getAccuracy = () => {
    return sessionStats.totalAnswers > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.totalAnswers) * 100)
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    )
  }

  if (!currentWord || studyWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">학습할 단어가 없습니다</h1>
          <Button onClick={() => router.push('/')} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Button
            onClick={() => router.push(packSlug ? `/pack/${packSlug}` : '/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-white">
              {mode === 'flashcard' ? '플래시카드' : mode === 'quiz' ? '퀴즈' : '스펠링'} 학습
            </h1>
            <p className="text-slate-300 text-sm">
              {currentIndex + 1} / {studyWords.length}
            </p>
          </div>

          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-6">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-300">
            <span>진행률: {Math.round(progress)}%</span>
            <span>정확도: {getAccuracy()}%</span>
            <span>시간: {getSessionDuration()}</span>
          </div>
        </div>

        {/* Study Content */}
        <AnimatePresence mode="wait">
          {!isSessionComplete ? (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="px-6"
            >
              <StudyCard
                word={currentWord}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canNavigate={{
                  prev: currentIndex > 0,
                  next: currentIndex < studyWords.length - 1,
                }}
                showAnswer={showAnswer}
                onToggleAnswer={handleToggleAnswer}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6"
            >
              <SessionCompleteScreen
                stats={{
                  duration: getSessionDuration(),
                  accuracy: getAccuracy(),
                  totalWords: studyWords.length,
                  correctAnswers: sessionStats.correctAnswers,
                  incorrectWords: sessionStats.incorrectWords,
                }}
                onRestart={restartSession}
                onGoHome={() => router.push('/')}
                onReviewErrors={() => {
                  // TODO: Implement error review mode
                  router.push(`/pack/${packSlug}`)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface SessionCompleteScreenProps {
  stats: {
    duration: string
    accuracy: number
    totalWords: number
    correctAnswers: number
    incorrectWords: Word[]
  }
  onRestart: () => void
  onGoHome: () => void
  onReviewErrors: () => void
}

function SessionCompleteScreen({ stats, onRestart, onGoHome, onReviewErrors }: SessionCompleteScreenProps) {
  const getPerformanceMessage = () => {
    if (stats.accuracy >= 90) return { message: "완벽합니다! 🎉", color: "text-green-400" }
    if (stats.accuracy >= 80) return { message: "훌륭해요! 👏", color: "text-blue-400" }
    if (stats.accuracy >= 70) return { message: "잘했어요! 👍", color: "text-yellow-400" }
    return { message: "더 연습해보세요! 💪", color: "text-orange-400" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6"
      >
        <Trophy className="w-10 h-10 text-white" />
      </motion.div>

      <h1 className="text-4xl font-bold text-white mb-4">학습 완료!</h1>
      <p className={`text-xl ${performance.color} mb-8`}>{performance.message}</p>

      {/* Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.accuracy}%</div>
            <div className="text-slate-300">정확도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.correctAnswers}</div>
            <div className="text-slate-300">정답</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.totalWords}</div>
            <div className="text-slate-300">총 단어</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.duration}</div>
            <div className="text-slate-300">소요시간</div>
          </div>
        </div>
      </div>

      {/* Incorrect Words */}
      {stats.incorrectWords.length > 0 && (
        <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-400/30">
          <h3 className="text-lg font-bold text-white mb-4">
            틀린 단어 ({stats.incorrectWords.length}개)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.incorrectWords.slice(0, 6).map((word) => (
              <div key={word.id} className="bg-white/5 rounded-lg p-3 text-left">
                <div className="font-semibold text-white">{word.term}</div>
                <div className="text-slate-300 text-sm">{word.meaning_ko}</div>
              </div>
            ))}
          </div>
          {stats.incorrectWords.length > 6 && (
            <p className="text-slate-400 mt-3">...그리고 {stats.incorrectWords.length - 6}개 더</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          다시 학습하기
        </Button>
        
        {stats.incorrectWords.length > 0 && (
          <Button
            onClick={onReviewErrors}
            size="lg"
            variant="outline"
            className="border-red-400/50 text-red-300 hover:bg-red-500/10"
          >
            <Target className="w-5 h-5 mr-2" />
            틀린 단어 복습
          </Button>
        )}

        <Button
          onClick={onGoHome}
          size="lg"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Home className="w-5 h-5 mr-2" />
          홈으로
        </Button>
      </div>
    </div>
  )
}