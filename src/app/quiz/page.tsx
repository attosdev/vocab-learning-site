'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import {
  Brain,
  Trophy,
  Timer,
  Zap,
  Target,
  Flame,
  Star,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const mockWords = [
  {
    id: 1,
    word: "abundant",
    pronunciation: "/əˈbʌndənt/",
    meaning: "풍부한, 많은",
    difficulty: "intermediate"
  },
  {
    id: 2,
    word: "reluctant",
    pronunciation: "/rɪˈlʌktənt/",
    meaning: "꺼리는, 마지못한",
    difficulty: "intermediate"
  },
  {
    id: 3,
    word: "demonstrate",
    pronunciation: "/ˈdemənstreɪt/",
    meaning: "보여주다, 실증하다",
    difficulty: "basic"
  },
  {
    id: 4,
    word: "magnificent",
    pronunciation: "/mæɡˈnɪfɪsənt/",
    meaning: "장엄한, 웅장한",
    difficulty: "advanced"
  },
  {
    id: 5,
    word: "persistent",
    pronunciation: "/pərˈsɪstənt/",
    meaning: "지속적인, 끈질긴",
    difficulty: "advanced"
  }
]

interface QuizQuestion {
  id: number
  word: string
  pronunciation: string
  options: string[]
  correctAnswer: string
  difficulty: string
}

const difficultyColors = {
  basic: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
}

export default function QuizPage() {
  const { user } = useAuth()
  const { updateProgress } = useLearningProgress()
  
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [sessionXP, setSessionXP] = useState(0)
  const [answers, setAnswers] = useState<{correct: boolean, selected: string, correctAnswer: string}[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateQuestions = () => {
    const shuffled = [...mockWords].sort(() => Math.random() - 0.5)
    const quizQuestions: QuizQuestion[] = shuffled.map(word => {
      const incorrectOptions = mockWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning)
      
      const options = [word.meaning, ...incorrectOptions].sort(() => Math.random() - 0.5)
      
      return {
        id: word.id,
        word: word.word,
        pronunciation: word.pronunciation,
        options,
        correctAnswer: word.meaning,
        difficulty: word.difficulty
      }
    })
    
    setQuestions(quizQuestions)
  }

  const startQuiz = () => {
    generateQuestions()
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setTimeElapsed(0)
    setStreak(0)
    setSessionXP(0)
    setAnswers([])
    setSelectedAnswer('')
  }

  const playPronunciation = () => {
    if ('speechSynthesis' in window && questions[currentQuestion]) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const newAnswers = [...answers, {
      correct: isCorrect,
      selected: selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer
    }]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
      setBestStreak(Math.max(bestStreak, streak + 1))
      setSessionXP(sessionXP + (15 + (streak * 2))) // 스트릭 보너스
    } else {
      setStreak(0)
    }

    // 진도 업데이트
    if (user) {
      await updateProgress(questions[currentQuestion].id, isCorrect)
    }

    if (currentQuestion + 1 >= questions.length) {
      setGameState('finished')
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    }
  }

  const resetQuiz = () => {
    setGameState('ready')
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setTimeElapsed(0)
    setStreak(0)
    setSessionXP(0)
    setAnswers([])
  }

  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* 헤더 */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-blue-600 text-4xl mx-auto mb-4 shadow-2xl"
              >
                <Brain className="h-12 w-12 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">도전 퀴즈</h1>
              <p className="text-lg text-gray-600">
                실력을 테스트하고 XP를 획득하세요!
              </p>
            </div>

            {/* 퀴즈 정보 */}
            <Card className="border-0 shadow-xl mb-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mx-auto mb-3">
                      <Target className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">5문제</h3>
                    <p className="text-sm text-gray-600">선별된 어휘 문제</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mx-auto mb-3">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">XP 획득</h3>
                    <p className="text-sm text-gray-600">스트릭 보너스 포함</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mx-auto mb-3">
                      <Timer className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">시간 제한 없음</h3>
                    <p className="text-sm text-gray-600">충분히 생각하세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 시작 버튼 */}
            <Button
              onClick={startQuiz}
              size="lg"
              className="w-full h-16 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              <Brain className="h-6 w-6 mr-3" />
              퀴즈 시작하기
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameState === 'finished') {
    const accuracy = Math.round((score / questions.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* 결과 헤더 */}
            <Card className="border-0 shadow-xl mb-6">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">퀴즈 완료!</h1>
                  <p className="text-gray-600">수고하셨습니다!</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-4xl font-bold text-blue-600 mb-1">{score}/{questions.length}</p>
                    <p className="text-sm text-gray-600">정답 수</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-green-600 mb-1">{accuracy}%</p>
                    <p className="text-sm text-gray-600">정답률</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상세 통계 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Timer className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xl font-bold">{formatTime(timeElapsed)}</p>
                  <p className="text-xs text-muted-foreground">소요 시간</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-xl font-bold">{bestStreak}</p>
                  <p className="text-xs text-muted-foreground">최대 스트릭</p>
                </CardContent>
              </Card>
            </div>

            {/* XP 획득 */}
            <Card className="border-0 shadow-xl mb-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 mx-auto mb-3" />
                <p className="text-3xl font-bold mb-2">{sessionXP} XP</p>
                <p className="text-purple-100">획득한 경험치</p>
              </CardContent>
            </Card>

            {/* 상세 결과 */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg">상세 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {answers[index].correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">{question.word}</span>
                      <Badge className={cn("text-xs", difficultyColors[question.difficulty as keyof typeof difficultyColors])}>
                        {question.difficulty === 'basic' ? '기초' : 
                         question.difficulty === 'intermediate' ? '중급' : '고급'}
                      </Badge>
                    </div>
                    {answers[index].correct && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex gap-4">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="flex-1 h-12"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                다시 도전
              </Button>
              <Button
                onClick={() => window.location.href = '/learn'}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                학습하기
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // 퀴즈 진행 중
  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">문제를 불러오는 중...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      {/* 상단 상태 바 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
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
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{score}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>문제 {currentQuestion + 1} / {questions.length}</span>
          <span>{Math.round(progress)}% 완료</span>
        </div>
        <Progress value={progress} className="h-3" />
      </motion.div>

      {/* 메인 퀴즈 카드 */}
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <Badge className={cn("mb-4 mx-auto w-fit", difficultyColors[currentQ.difficulty as keyof typeof difficultyColors])}>
                  {currentQ.difficulty === 'basic' ? '기초' : 
                   currentQ.difficulty === 'intermediate' ? '중급' : '고급'}
                </Badge>
                
                <CardTitle className="text-4xl font-bold text-gray-900">
                  {currentQ.word}
                </CardTitle>
                
                <p className="text-lg text-gray-600 mt-2">
                  {currentQ.pronunciation}
                </p>
                
                <Button
                  variant="ghost"
                  onClick={playPronunciation}
                  className="mt-2 w-fit mx-auto"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  발음 듣기
                </Button>
              </CardHeader>

              <CardContent>
                <p className="text-center text-lg font-medium mb-6">
                  다음 단어의 뜻으로 올바른 것은?
                </p>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedAnswer === option ? "default" : "outline"}
                        className="w-full p-4 h-auto text-left justify-start"
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    size="lg"
                    className="h-12 px-8"
                  >
                    {currentQuestion + 1 === questions.length ? '결과 보기' : '다음 문제'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}