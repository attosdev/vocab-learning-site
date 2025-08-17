'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { vocabData } from '@/data/vocab-data'
import { VocabWord } from '@/types/vocab'
import { useAuth } from '@/hooks/useAuth'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface QuizQuestion {
  word: VocabWord
  options: string[]
  correctAnswer: string
}

export default function QuizPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { updateProgress } = useLearningProgress()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean; selected: string; correct_answer: string }[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<Date>(new Date())

  // Generate quiz questions and start session
  useEffect(() => {
    const generateQuestions = async () => {
      const shuffled = [...vocabData].sort(() => Math.random() - 0.5)
      const selectedWords = shuffled.slice(0, 10)
      
      const quizQuestions: QuizQuestion[] = selectedWords.map(word => {
        const incorrectOptions = vocabData
          .filter(w => w.id !== word.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.definition)
        
        const options = [word.definition, ...incorrectOptions].sort(() => Math.random() - 0.5)
        
        return {
          word,
          options,
          correctAnswer: word.definition
        }
      })
      
      setQuestions(quizQuestions)
      setStartTime(new Date())

      // 로그인한 사용자만 세션 저장
      if (user) {
        try {
          const { data, error } = await supabase
            .from('quiz_sessions')
            .insert({
              user_id: user.id,
              quiz_type: 'multiple-choice',
              total_questions: quizQuestions.length,
              started_at: new Date().toISOString()
            })
            .select()
            .single()

          if (error) {
            console.error('Error creating quiz session:', error)
          } else {
            setSessionId(data.id)
          }
        } catch (error) {
          console.error('Error creating quiz session:', error)
        }
      }
    }
    
    generateQuestions()
  }, [user])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const currentWord = questions[currentQuestion].word
    const newAnswers = [...answers, {
      correct: isCorrect,
      selected: selectedAnswer,
      correct_answer: questions[currentQuestion].correctAnswer
    }]
    setAnswers(newAnswers)

    const newScore = isCorrect ? score + 1 : score
    setScore(newScore)

    // 로그인한 사용자의 경우 진도와 답변 저장
    if (user && sessionId) {
      try {
        // 학습 진도 업데이트
        await updateProgress(currentWord.id, isCorrect)

        // 퀴즈 답변 저장
        await supabase
          .from('quiz_answers')
          .insert({
            session_id: sessionId,
            word_id: currentWord.id,
            user_answer: selectedAnswer,
            correct_answer: questions[currentQuestion].correctAnswer,
            is_correct: isCorrect
          })
      } catch (error) {
        console.error('Error saving quiz answer:', error)
      }
    }

    if (currentQuestion + 1 >= questions.length) {
      // 퀴즈 완료 시 세션 업데이트
      if (user && sessionId) {
        try {
          const endTime = new Date()
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
          
          await supabase
            .from('quiz_sessions')
            .update({
              completed_at: endTime.toISOString(),
              correct_answers: newScore,
              score: Math.round((newScore / questions.length) * 100),
              duration_seconds: duration
            })
            .eq('id', sessionId)
        } catch (error) {
          console.error('Error updating quiz session:', error)
        }
      }
      setShowResult(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setAnswers([])
    // Regenerate questions
    const shuffled = [...vocabData].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, 10)
    
    const quizQuestions: QuizQuestion[] = selectedWords.map(word => {
      const incorrectOptions = vocabData
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.definition)
      
      const options = [word.definition, ...incorrectOptions].sort(() => Math.random() - 0.5)
      
      return {
        word,
        options,
        correctAnswer: word.definition
      }
    })
    
    setQuestions(quizQuestions)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">퀴즈를 준비하고 있습니다...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">📚 고등 어휘 마스터</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">홈</Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">대시보드</Link>
            )}
            <Link href="/flashcard" className="text-sm font-medium hover:text-primary transition-colors">플래시카드</Link>
            <Link href="/quiz" className="text-sm font-medium text-primary">퀴즈</Link>
          </nav>
          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : user ? (
              <>
                {profile?.avatar_url && (
                  <img src={profile.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm font-medium">{profile?.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>로그아웃</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">로그인</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {showResult ? (
          // Results Screen
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">🎉 퀴즈 완료!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-xl text-gray-600">
                    정답률: {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">상세 결과</h3>
                  {questions.map((question, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          answers[index].correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {answers[index].correct ? '✓' : '✗'}
                        </span>
                        <span className="font-medium">{question.word.word}</span>
                      </div>
                      {!answers[index].correct && (
                        <div className="ml-8 text-sm">
                          <p className="text-red-600">선택: {answers[index].selected}</p>
                          <p className="text-green-600">정답: {answers[index].correct_answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button onClick={resetQuiz} size="lg">
                    다시 도전하기
                  </Button>
                  <Link href="/flashcard">
                    <Button variant="outline" size="lg">
                      플래시카드로 복습
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Quiz Screen
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>문제 {currentQuestion + 1} / {questions.length}</span>
                <span>점수: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {questions[currentQuestion].word.word}
                </CardTitle>
                {questions[currentQuestion].word.pronunciation && (
                  <p className="text-center text-gray-500">
                    {questions[currentQuestion].word.pronunciation}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-lg font-medium mb-6">
                  다음 단어의 뜻으로 올바른 것은?
                </p>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="w-full p-4 h-auto text-left justify-start"
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    size="lg"
                  >
                    {currentQuestion + 1 === questions.length ? '결과 보기' : '다음 문제'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}