'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Trophy,
  Target,
  Flame,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - 실제로는 Supabase에서 가져와야 함
const mockWords = [
  {
    id: 1,
    word: "abundant",
    pronunciation: "/əˈbʌndənt/",
    meaning: "풍부한, 많은",
    example: "The forest was abundant with wildlife.",
    exampleTranslation: "그 숲은 야생동물이 풍부했다.",
    difficulty: "intermediate"
  },
  {
    id: 2,
    word: "reluctant",
    pronunciation: "/rɪˈlʌktənt/",
    meaning: "꺼리는, 마지못한",
    example: "She was reluctant to speak in public.",
    exampleTranslation: "그녀는 공개적으로 말하기를 꺼렸다.",
    difficulty: "intermediate"
  },
  {
    id: 3,
    word: "demonstrate",
    pronunciation: "/ˈdemənstreɪt/",
    meaning: "보여주다, 실증하다",
    example: "The teacher will demonstrate the experiment.",
    exampleTranslation: "선생님이 실험을 시연해 주실 것이다.",
    difficulty: "basic"
  },
  {
    id: 4,
    word: "magnificent",
    pronunciation: "/mæɡˈnɪfɪsənt/",
    meaning: "장엄한, 웅장한",
    example: "The view from the mountain was magnificent.",
    exampleTranslation: "산에서 본 경치는 장관이었다.",
    difficulty: "advanced"
  },
  {
    id: 5,
    word: "persistent",
    pronunciation: "/pərˈsɪstənt/",
    meaning: "지속적인, 끈질긴",
    example: "His persistent efforts finally paid off.",
    exampleTranslation: "그의 끈질긴 노력이 마침내 결실을 맺었다.",
    difficulty: "advanced"
  }
]

const difficultyColors = {
  basic: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
}

export default function FlashcardPage() {
  const { user } = useAuth()
  const { updateProgress } = useLearningProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedWords, setStudiedWords] = useState<Set<number>>(new Set())
  const [correctWords, setCorrectWords] = useState<Set<number>>(new Set())
  const [sessionXP, setSessionXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const currentWord = mockWords[currentIndex]
  const totalWords = mockWords.length
  const progress = (studiedWords.size / totalWords) * 100

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">카드를 불러오는 중...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalWords)
    setIsFlipped(false)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords)
    setIsFlipped(false)
  }

  const handleKnow = async () => {
    if (!correctWords.has(currentWord.id)) {
      setCorrectWords(prev => new Set(prev).add(currentWord.id))
      setStreak(streak + 1)
      setSessionXP(sessionXP + 15)
    }
    setStudiedWords(prev => new Set(prev).add(currentWord.id))
    
    if (user) {
      await updateProgress(currentWord.id, true)
    }
    
    handleNext()
  }

  const handleDontKnow = async () => {
    setStudiedWords(prev => new Set(prev).add(currentWord.id))
    setStreak(0)
    
    if (user) {
      await updateProgress(currentWord.id, false)
    }
    
    handleNext()
  }

  const shuffleCards = () => {
    const randomIndex = Math.floor(Math.random() * totalWords)
    setCurrentIndex(randomIndex)
    setIsFlipped(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      {/* 상단 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* 제목과 상태 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              플래시카드 복습
            </h1>
            <p className="text-gray-600 mt-1">카드를 탭해서 뜻을 확인하세요</p>
          </div>
          
          {/* 실시간 통계 */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-blue-600 text-sm">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-orange-600 text-sm">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-semibold text-purple-600 text-sm">{sessionXP} XP</span>
            </div>
          </div>
        </div>

        {/* 진행률 카드 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">학습 진도</span>
            <span className="text-sm font-bold text-indigo-600">{currentIndex + 1} / {totalWords}</span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-100" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">시작</span>
            <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}% 완료</span>
            <span className="text-xs text-gray-500">완료</span>
          </div>
        </div>
      </motion.div>

      {/* 메인 플래시카드 */}
      <div className="mx-auto max-w-2xl">
        <motion.div className="relative perspective-1000 mb-8">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="preserve-3d"
          >
            <Card 
              className="border-0 shadow-2xl cursor-pointer min-h-[450px] relative overflow-hidden bg-gradient-to-br from-white to-gray-50"
              onClick={handleFlip}
            >
              {/* 카드 장식 요소 */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-30" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-40" />
              
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="preserve-3d w-full h-full relative z-10"
              >
                {/* 앞면 - 단어 */}
                <div className={cn(
                  "absolute inset-0 backface-hidden",
                  isFlipped && "invisible"
                )}>
                  <CardContent className="flex flex-col items-center justify-center h-[450px] p-8 relative">
                    <Badge className={cn("mb-6 text-sm px-4 py-2", difficultyColors[currentWord.difficulty as keyof typeof difficultyColors])}>
                      {currentWord.difficulty === 'basic' ? '🟢 기초' : 
                       currentWord.difficulty === 'intermediate' ? '🟡 중급' : '🔴 고급'}
                    </Badge>
                    
                    <motion.h2 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center"
                    >
                      {currentWord.word}
                    </motion.h2>
                    
                    <p className="text-xl text-gray-600 mb-8 font-mono">
                      {currentWord.pronunciation}
                    </p>
                    
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        playPronunciation()
                      }}
                      className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors px-6 py-3 rounded-full"
                    >
                      <Volume2 className="h-5 w-5" />
                      🔊 발음 듣기
                    </Button>
                    
                    <motion.p 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-sm text-gray-400 mt-8 bg-gray-50 px-4 py-2 rounded-full"
                    >
                      💡 카드를 탭해서 뜻을 확인하세요
                    </motion.p>
                  </CardContent>
                </div>

                {/* 뒷면 - 뜻과 예문 */}
                <div className={cn(
                  "absolute inset-0 backface-hidden rotateY-180",
                  !isFlipped && "invisible"
                )}>
                  <CardContent className="flex flex-col justify-center h-[450px] p-8 relative">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        {currentWord.meaning}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mx-auto"></div>
                    </motion.div>
                    
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-indigo-400">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">💬</span>
                        <h4 className="font-semibold text-gray-700">예문</h4>
                      </div>
                      <p className="text-gray-900 mb-4 italic text-lg leading-relaxed">
                        &ldquo;{currentWord.example}&rdquo;
                      </p>
                      <p className="text-gray-600 text-base">
                        {currentWord.exampleTranslation}
                      </p>
                    </div>
                    
                    <motion.p 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-sm text-gray-400 mt-6 text-center bg-gray-50 px-4 py-2 rounded-full mx-auto"
                    >
                      🔄 다시 탭해서 단어 보기
                    </motion.p>
                  </CardContent>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>

        {/* 답변 버튼 (뒷면일 때만) */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex gap-4 mb-8"
            >
              <Button
                onClick={handleDontKnow}
                variant="outline"
                className="flex-1 h-16 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200 rounded-2xl font-semibold text-lg shadow-lg"
              >
                <XCircle className="h-6 w-6 mr-3" />
                ❌ 모르겠어요
              </Button>
              <Button
                onClick={handleKnow}
                className="flex-1 h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-200 rounded-2xl font-semibold text-lg shadow-lg text-white"
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                ✅ 알고 있어요
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="h-14 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            이전
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFlipped(false)}
              className="h-14 px-6 rounded-2xl border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
              title="카드 뒤집기 초기화"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={shuffleCards}
              className="h-14 px-6 rounded-2xl border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
              title="랜덤 카드"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            className="h-14 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
          >
            다음
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* 통계 카드 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mt-10"
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-700 mb-1">{studiedWords.size}</p>
              <p className="text-sm text-blue-600 font-medium">📚 학습 완료</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">{correctWords.size}</p>
              <p className="text-sm text-green-600 font-medium">⭐ 정답</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-yellow-700 mb-1">{sessionXP}</p>
              <p className="text-sm text-yellow-600 font-medium">⚡ 획득 XP</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}