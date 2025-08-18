'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Brain,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Zap,
  ChevronRight,
} from 'lucide-react'

// 로그인 페이지 컴포넌트
function LoginPage() {
  const { signInWithGoogle } = useAuth()
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute -left-4 top-20 h-72 w-72 animate-pulse rounded-full bg-blue-300 opacity-20 blur-3xl" />
        <div className="absolute -right-4 bottom-20 h-72 w-72 animate-pulse rounded-full bg-purple-300 opacity-20 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          {/* 로고 */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-2xl"
            >
              V
            </motion.div>
          </div>

          {/* 타이틀 */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              VocabMaster
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              게임처럼 재미있는 어휘 학습의 시작
            </p>
          </div>

          {/* 특징 */}
          <div className="grid grid-cols-3 gap-4 py-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xs text-gray-600">AI 맞춤학습</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="text-xs text-gray-600">게임화</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-xs text-gray-600">실시간 진도</span>
            </motion.div>
          </div>

          {/* 로그인 버튼 */}
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            구글로 시작하기
          </Button>

          {/* 통계 */}
          <div className="flex justify-center gap-8 pt-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">10K+</p>
              <p className="text-xs text-gray-600">학습 단어</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5K+</p>
              <p className="text-xs text-gray-600">활성 사용자</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-xs text-gray-600">만족도</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// 대시보드 홈 컴포넌트
function DashboardHome() {
  const { user, profile } = useAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('좋은 아침이에요')
    else if (hour < 18) setGreeting('좋은 오후에요')
    else setGreeting('좋은 저녁이에요')
  }, [])

  // Mock 데이터
  const todayGoal = 20
  const todayCompleted = 12
  const streakDays = 7
  const totalWords = 156
  const masteredWords = 89

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {profile?.name || user?.email?.split('@')[0]}님! 👋
        </h1>
        <p className="mt-1 text-gray-600">오늘도 열심히 공부해볼까요?</p>
      </motion.div>

      {/* 오늘의 목표 카드 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">오늘의 목표</p>
                <p className="mt-2 text-3xl font-bold">
                  {todayCompleted} / {todayGoal} 단어
                </p>
                <Progress
                  value={(todayCompleted / todayGoal) * 100}
                  className="mt-3 h-2 bg-white/20"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Target className="h-8 w-8" />
                </div>
                <Badge className="bg-white/20 text-white">
                  {Math.round((todayCompleted / todayGoal) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 통계 카드들 */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">연속 학습</p>
                  <p className="text-2xl font-bold">{streakDays}일</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">학습 단어</p>
                  <p className="text-2xl font-bold">{totalWords}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">마스터</p>
                  <p className="text-2xl font-bold">{masteredWords}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">정답률</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 빠른 시작 버튼들 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <Link href="/learn">
          <Card className="group cursor-pointer border-0 shadow-md transition-all hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">오늘의 학습</h3>
                  <p className="text-sm text-muted-foreground">
                    새로운 단어 학습하기
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/flashcard">
          <Card className="group cursor-pointer border-0 shadow-md transition-all hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">플래시카드</h3>
                  <p className="text-sm text-muted-foreground">
                    빠른 복습하기
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quiz">
          <Card className="group cursor-pointer border-0 shadow-md transition-all hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">도전 퀴즈</h3>
                  <p className="text-sm text-muted-foreground">
                    실력 테스트하기
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return user ? <DashboardHome /> : <LoginPage />
}