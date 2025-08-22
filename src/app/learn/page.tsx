'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Volume2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  ArrowRight,
  Heart,
  Target,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock 데이터
const mockWords = [
  {
    id: 1,
    word: "abundant",
    pronunciation: "/əˈbʌndənt/",
    meaning: "풍부한, 많은",
    example: "The forest was abundant with wildlife.",
    exampleTranslation: "그 숲은 야생동물이 풍부했다.",
    difficulty: "intermediate",
    category: "adjective"
  },
  {
    id: 2,
    word: "reluctant",
    pronunciation: "/rɪˈlʌktənt/",
    meaning: "꺼리는, 마지못한",
    example: "She was reluctant to speak in public.",
    exampleTranslation: "그녀는 공개적으로 말하기를 꺼렸다.",
    difficulty: "intermediate",
    category: "adjective"
  },
  {
    id: 3,
    word: "demonstrate",
    pronunciation: "/ˈdemənstreɪt/",
    meaning: "보여주다, 실증하다",
    example: "The teacher will demonstrate the experiment.",
    exampleTranslation: "선생님이 실험을 시연해 주실 것이다.",
    difficulty: "basic",
    category: "verb"
  },
  {
    id: 4,
    word: "magnificent",
    pronunciation: "/mæɡˈnɪfɪsənt/",
    meaning: "장엄한, 웅장한",
    example: "The view from the mountain was magnificent.",
    exampleTranslation: "산에서 본 경치는 장관이었다.",
    difficulty: "advanced",
    category: "adjective"
  },
  {
    id: 5,
    word: "persistent",
    pronunciation: "/pərˈsɪstənt/",
    meaning: "지속적인, 끈질긴",
    example: "His persistent efforts finally paid off.",
    exampleTranslation: "그의 끈질긴 노력이 마침내 결실을 맺었다.",
    difficulty: "advanced",
    category: "adjective"
  }
]

const difficultyColors = {
  basic: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
}

const difficultyLabels = {
  basic: "기초",
  intermediate: "중급",
  advanced: "고급"
}

export default function LearnPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [completedWords, setCompletedWords] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [sessionXP, setSessionXP] = useState(0)

  const currentWord = mockWords[currentWordIndex]
  const progress = ((currentWordIndex + 1) / mockWords.length) * 100

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">단어를 불러오는 중...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  const handleKnowWord = () => {
    if (!completedWords.includes(currentWord.id)) {
      setCompletedWords([...completedWords, currentWord.id])
      setStreak(streak + 1)
      setSessionXP(sessionXP + 10)
    }
    nextWord()
  }

  const handleDontKnow = () => {
    if (hearts > 1) {
      setHearts(hearts - 1)
    }
    setStreak(0)
    nextWord()
  }

  const nextWord = () => {
    setShowMeaning(false)
    if (currentWordIndex < mockWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      // 학습 완료
      setCurrentWordIndex(0)
    }
  }

  const previousWord = () => {
    setShowMeaning(false)
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
    }
  }

  const playPronunciation = () => {
    // Text-to-Speech API 호출 예정
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">오늘의 학습</h1>
            <p className="text-gray-600">새로운 어휘를 배워보세요</p>
          </div>
          
          {/* 상태 표시 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-600">{streak}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-blue-600">{sessionXP} XP</span>
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{currentWordIndex + 1} / {mockWords.length}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
          <Progress value={progress} className="mt-2 h-3" />
        </div>
      </motion.div>

      {/* 메인 학습 카드 */}
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-xs", difficultyColors[currentWord.difficulty as keyof typeof difficultyColors])}>
                    {difficultyLabels[currentWord.difficulty as keyof typeof difficultyLabels]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentWord.category}
                  </Badge>
                </div>
                
                <CardTitle className="text-4xl font-bold text-gray-900 mt-4">
                  {currentWord.word}
                </CardTitle>
                
                <CardDescription className="text-lg text-gray-600 mt-2">
                  {currentWord.pronunciation}
                </CardDescription>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playPronunciation}
                  className="mt-2 w-fit mx-auto"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  발음 듣기
                </Button>
              </CardHeader>

              <CardContent className="pt-0">
                <AnimatePresence>
                  {showMeaning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      {/* 뜻 */}
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {currentWord.meaning}
                        </h3>
                      </div>

                      {/* 예문 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-700 mb-2">예문</h4>
                        <p className="text-gray-900 mb-2 italic">
                          &ldquo;{currentWord.example}&rdquo;
                        </p>
                        <p className="text-gray-600 text-sm">
                          {currentWord.exampleTranslation}
                        </p>
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={handleDontKnow}
                          className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          모르겠어요
                        </Button>
                        <Button
                          onClick={handleKnowWord}
                          className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          알고 있어요
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 뜻 보기 버튼 */}
                {!showMeaning && (
                  <div className="text-center">
                    <Button
                      onClick={() => setShowMeaning(true)}
                      size="lg"
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    >
                      뜻 보기
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={previousWord}
            disabled={currentWordIndex === 0}
            className="h-12 px-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            이전
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowMeaning(false)}
            className="h-12 px-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            다시보기
          </Button>
          
          <Button
            variant="outline"
            onClick={nextWord}
            disabled={currentWordIndex === mockWords.length - 1}
            className="h-12 px-6"
          >
            다음
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* 학습 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{completedWords.length}</p>
              <p className="text-xs text-muted-foreground">학습 완료</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-xs text-muted-foreground">연속 정답</p>
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