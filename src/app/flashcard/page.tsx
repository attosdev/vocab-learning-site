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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">플래시카드 복습</h1>
            <p className="text-gray-600">카드를 클릭해서 뜻을 확인하세요</p>
          </div>
          
          {/* 상태 표시 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-blue-600">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-600">{streak}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="font-bold text-purple-600">{sessionXP} XP</span>
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{currentIndex + 1} / {totalWords}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
          <Progress value={progress} className="mt-2 h-3" />
        </div>
      </motion.div>

      {/* 메인 플래시카드 */}
      <div className="mx-auto max-w-2xl">
        <motion.div className="relative perspective-1000 mb-6">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="preserve-3d"
          >
            <Card 
              className="border-0 shadow-2xl cursor-pointer min-h-[400px] relative"
              onClick={handleFlip}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="preserve-3d w-full h-full"
              >
                {/* 앞면 - 단어 */}
                <div className={cn(
                  "absolute inset-0 backface-hidden",
                  isFlipped && "invisible"
                )}>
                  <CardContent className="flex flex-col items-center justify-center h-[400px] p-8">
                    <Badge className={cn("mb-4", difficultyColors[currentWord.difficulty as keyof typeof difficultyColors])}>
                      {currentWord.difficulty === 'basic' ? '기초' : 
                       currentWord.difficulty === 'intermediate' ? '중급' : '고급'}
                    </Badge>
                    
                    <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
                      {currentWord.word}
                    </h2>
                    
                    <p className="text-xl text-gray-600 mb-6">
                      {currentWord.pronunciation}
                    </p>
                    
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        playPronunciation()
                      }}
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="h-5 w-5" />
                      발음 듣기
                    </Button>
                    
                    <p className="text-sm text-gray-500 mt-8">카드를 클릭하여 뜻 보기</p>
                  </CardContent>
                </div>

                {/* 뒷면 - 뜻과 예문 */}
                <div className={cn(
                  "absolute inset-0 backface-hidden rotateY-180",
                  !isFlipped && "invisible"
                )}>
                  <CardContent className="flex flex-col justify-center h-[400px] p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentWord.meaning}
                      </h3>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-700 mb-3">예문</h4>
                      <p className="text-gray-900 mb-3 italic text-lg">
                        &ldquo;{currentWord.example}&rdquo;
                      </p>
                      <p className="text-gray-600">
                        {currentWord.exampleTranslation}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-6 text-center">카드를 클릭하여 단어 보기</p>
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
              className="flex gap-4 mb-6"
            >
              <Button
                onClick={handleDontKnow}
                variant="outline"
                className="flex-1 h-14 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-5 w-5 mr-2" />
                모르겠어요
              </Button>
              <Button
                onClick={handleKnow}
                className="flex-1 h-14 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                알고 있어요
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="h-12 px-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            이전
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFlipped(false)}
              className="h-12 px-4"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={shuffleCards}
              className="h-12 px-4"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            className="h-12 px-6"
          >
            다음
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{studiedWords.size}</p>
              <p className="text-xs text-muted-foreground">학습 완료</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{correctWords.size}</p>
              <p className="text-xs text-muted-foreground">정답</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{sessionXP}</p>
              <p className="text-xs text-muted-foreground">획득 XP</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}