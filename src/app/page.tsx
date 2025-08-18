'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Brain,
  Trophy,
  Target,
  Flame,
  Zap,
  ChevronRight,
} from 'lucide-react'

// 🚀 혁신적인 TikTok 스타일 로그인 페이지
function LoginPage() {
  const { signInWithGoogle } = useAuth()
  
  return (
    <div className="relative min-h-screen overflow-hidden full-screen">
      {/* 🌊 동적 배경 시스템 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#9C92AC" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></g></svg>')}")`,
        }}></div>
        
        {/* 🎨 플로팅 요소들 */}
        <div className="absolute -left-10 top-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -right-10 top-3/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-float" style={{animationDelay: '-1s'}}></div>
        <div className="absolute left-1/2 top-1/2 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '-2s'}}></div>
      </div>

      {/* 🎭 메인 콘텐츠 */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          {/* 🌟 혁신적 로고 */}
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl immersive-card neon-glow-primary">
                <span className="text-5xl font-black text-gradient-primary">V</span>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce">
                  <span className="absolute inset-0 flex items-center justify-center text-xs">✨</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 🎯 임팩트 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-gradient-primary mb-4 tracking-tight leading-tight">
              VocabMaster
            </h1>
            <motion.p 
              className="text-xl text-white/90 font-medium mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              🚀 AI가 만드는 단어 학습의 혁명
            </motion.p>
          </motion.div>

          {/* 🌈 인터랙티브 특징 카드 */}
          <motion.div 
            className="grid grid-cols-1 gap-4 py-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, staggerChildren: 0.1 }}
          >
            {[
              { icon: "🧠", title: "AI 맞춤 학습", desc: "개인화된 학습 경험" },
              { icon: "🎮", title: "게이미피케이션", desc: "재미있는 도전과 보상" },
              { icon: "📊", title: "실시간 분석", desc: "학습 패턴 최적화" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="immersive-card p-6 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div className="text-left">
                    <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 🎨 슈퍼 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="w-full h-16 btn-primary text-lg font-bold rounded-2xl relative overflow-hidden group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              🚀 Google로 모험 시작하기
            </Button>
          </motion.div>

          {/* 📊 실시간 통계 - 홀로그램 스타일 */}
          <motion.div 
            className="grid grid-cols-3 gap-6 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[
              { number: "50K+", label: "🎯 학습 단어", glow: "from-blue-400 to-purple-400" },
              { number: "15K+", label: "🎮 활성 사용자", glow: "from-purple-400 to-pink-400" },
              { number: "99%", label: "⭐ 만족도", glow: "from-pink-400 to-yellow-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${stat.glow} bg-opacity-20 backdrop-blur-sm`}>
                  <p className="text-3xl font-black text-white mb-1">{stat.number}</p>
                  <p className="text-xs text-white/80 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 🎵 배경 펄스 이펙트 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

// 🎮 AI 개인화 대시보드 - TikTok 스타일 몰입형 경험
function DashboardHome() {
  const { user, profile } = useAuth()
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('새벽의 열정이 대단해요')
    else if (hour < 12) setGreeting('활기찬 아침이에요')
    else if (hour < 18) setGreeting('오후도 화이팅')
    else if (hour < 22) setGreeting('저녁 학습 시간')
    else setGreeting('야간 집중 모드')

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 🎯 AI 기반 개인화 데이터 (Mock - 실제로는 AI 분석 결과)
  const todayGoal = 25
  const todayCompleted = 18
  const streakDays = 12
  const totalWords = 342
  const masteredWords = 156
  const weeklyXP = 1250
  const currentLevel = 8
  const levelProgress = 67
  const aiRecommendation = "오늘은 비즈니스 단어에 집중하세요! 🎯"

  return (
    <div className="min-h-screen full-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 🌌 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
        }}></div>
        
        {/* 플로팅 파티클 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '-2s'}}></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 space-y-8">
        {/* 🎭 동적 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center space-y-4"
        >
          <div className="immersive-card p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-2">
              {greeting}, <span className="text-gradient-primary">{profile?.name || user?.email?.split('@')[0]}</span>님! 🚀
            </h1>
            <p className="text-white/80 text-lg font-medium">{aiRecommendation}</p>
            
            {/* 실시간 시계 */}
            <div className="mt-4 text-white/60 font-mono text-sm">
              {currentTime.toLocaleTimeString('ko-KR', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </div>
          </div>
        </motion.div>

        {/* 🎯 메인 목표 카드 - 홀로그램 스타일 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="immersive-card p-8 max-w-4xl mx-auto neon-glow-primary">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-white animate-pulse" />
                  <h2 className="text-2xl font-bold text-white">오늘의 목표</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-gradient-primary">{todayCompleted}</span>
                    <span className="text-2xl text-white/70 mb-2">/ {todayGoal} 단어</span>
                  </div>
                  
                  {/* XP 바 */}
                  <div className="space-y-2">
                    <div className="xp-bar" style={{width: `${(todayCompleted/todayGoal)*100}%`}}></div>
                    <p className="text-white/80 text-sm font-semibold">
                      {Math.round((todayCompleted / todayGoal) * 100)}% 달성! 🎉
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 3D 레벨 링 */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${levelProgress * 2.51} ${(100 - levelProgress) * 2.51}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-black text-gradient-gaming">Lv.{currentLevel}</div>
                      <div className="text-white/70 text-sm font-semibold">{levelProgress}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🎮 게이미피케이션 통계 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { 
              icon: <Flame className="h-10 w-10 streak-fire" />, 
              value: `${streakDays}일`, 
              label: "🔥 연속 학습",
              gradient: "from-orange-500 to-red-500",
              glow: "neon-glow-accent"
            },
            { 
              icon: <BookOpen className="h-10 w-10" />, 
              value: totalWords, 
              label: "📚 학습 단어",
              gradient: "from-blue-500 to-purple-500",
              glow: "neon-glow-primary"
            },
            { 
              icon: <Trophy className="h-10 w-10 achievement-glow" />, 
              value: masteredWords, 
              label: "⭐ 마스터",
              gradient: "from-yellow-500 to-orange-500",
              glow: "neon-glow-accent"
            },
            { 
              icon: <Zap className="h-10 w-10" />, 
              value: `${weeklyXP} XP`, 
              label: "⚡ 주간 XP",
              gradient: "from-green-500 to-emerald-500",
              glow: "neon-glow-primary"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`immersive-card p-6 text-center cursor-pointer ${stat.glow}`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/70 text-sm font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 🚀 인터랙티브 액션 카드 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {[
            {
              href: "/learn",
              icon: <BookOpen className="h-8 w-8" />,
              title: "🧠 AI 학습",
              desc: "맞춤형 단어 추천",
              gradient: "from-blue-600 to-purple-600",
              emoji: "🎯"
            },
            {
              href: "/flashcard",
              icon: <Zap className="h-8 w-8" />,
              title: "⚡ 플래시카드",
              desc: "3D 몰입형 복습",
              gradient: "from-purple-600 to-pink-600",
              emoji: "🎴"
            },
            {
              href: "/quiz",
              icon: <Brain className="h-8 w-8" />,
              title: "🏆 챌린지",
              desc: "실력 테스트 & 랭킹",
              gradient: "from-pink-600 to-red-600",
              emoji: "🎮"
            }
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="immersive-card p-8 cursor-pointer group relative overflow-hidden"
              >
                {/* 배경 그라데이션 효과 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl animate-float">{action.emoji}</div>
                    <ChevronRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient-primary transition-all duration-300">
                    {action.title}
                  </h3>
                  <p className="text-white/70 font-medium">{action.desc}</p>
                  
                  {/* 호버 효과 라인 */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* 🌟 AI 인사이트 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="immersive-card p-8 max-w-4xl mx-auto text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">🤖 AI 학습 분석</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-gradient-gaming">92%</div>
              <div className="text-white/70 text-sm">정답률</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gradient-primary">15분</div>
              <div className="text-white/70 text-sm">평균 집중시간</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gradient-gaming">비즈니스</div>
              <div className="text-white/70 text-sm">선호 카테고리</div>
            </div>
          </div>
        </motion.div>
      </div>
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