'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Brain,
  Trophy,
  Target,
  Flame,
  Zap,
  ChevronRight,
  Play,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useVocabStore } from '@/lib/store'
import { fetchWordPacks, WordPack } from '@/lib/supabase'

// Modern vocabulary learning homepage
function VocabHomePage() {
  const [wordPacks, setWordPacks] = useState<WordPack[]>([])
  const [loading, setLoading] = useState(true)
  const { settings, srsProgress, getWordsForReview } = useVocabStore()

  useEffect(() => {
    async function loadWordPacks() {
      try {
        const packs = await fetchWordPacks()
        setWordPacks(packs)
      } catch (error) {
        console.error('Failed to load word packs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadWordPacks()
  }, [])

  const reviewWords = getWordsForReview()
  const totalProgress = Object.keys(srsProgress).length
  const masteredWords = Object.values(srsProgress).filter(p => p.reps >= 3).length

  const getLevelInfo = (level: WordPack['level']) => {
    const configs = {
      beginner: { color: 'from-green-500 to-emerald-500', emoji: '🌱', label: '초급' },
      intermediate: { color: 'from-blue-500 to-cyan-500', emoji: '🌊', label: '중급' },
      advanced: { color: 'from-purple-500 to-violet-500', emoji: '🚀', label: '고급' },
      exam: { color: 'from-orange-500 to-red-500', emoji: '🎯', label: '시험' },
      topic: { color: 'from-pink-500 to-rose-500', emoji: '📚', label: '주제별' },
    }
    return configs[level] || configs.beginner
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-2xl"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Vocab<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Master</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            스마트한 반복 학습으로 영어 단어를 효과적으로 마스터하세요
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{reviewWords.length}</div>
              <div className="text-sm text-slate-300">복습 예정</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{totalProgress}</div>
              <div className="text-sm text-slate-300">학습 단어</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{masteredWords}</div>
              <div className="text-sm text-slate-300">마스터</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/study?mode=review">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">
                <Play className="w-5 h-5 mr-2" />
                복습 시작하기
              </Button>
            </Link>
            <Link href="/study?mode=new">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold">
                <BookOpen className="w-5 h-5 mr-2" />
                새 단어 학습
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Word Packs Grid */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">단어 팩 선택</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wordPacks.map((pack, index) => {
                const levelInfo = getLevelInfo(pack.level)
                return (
                  <motion.div
                    key={pack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <Link href={`/pack/${pack.slug}`}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                        {/* Level indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-sm font-medium`}>
                            <span className="mr-1">{levelInfo.emoji}</span>
                            {levelInfo.label}
                          </div>
                          <div className="text-2xl">{levelInfo.emoji}</div>
                        </div>

                        {/* Pack info */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {pack.title}
                        </h3>
                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                          {pack.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-400">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {pack.total_words} 단어
                          </div>
                          <div className="flex items-center text-purple-300">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">스마트 학습 시스템</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              과학적인 SRS 알고리즘과 개인화된 학습 경험으로 효율적인 단어 암기를 지원합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "스마트 복습",
                description: "SRS 알고리즘으로 최적의 복습 타이밍을 제공합니다",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "맞춤형 학습",
                description: "개인의 학습 패턴을 분석하여 맞춤형 콘텐츠를 제공합니다",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "진도 추적",
                description: "실시간으로 학습 진도와 성취도를 확인할 수 있습니다",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
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
  return <VocabHomePage />
}