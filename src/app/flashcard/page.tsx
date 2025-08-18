'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
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


// 🚀 TikTok 스타일 몰입형 플래시카드 경험
export default function FlashcardPage() {
  const { user } = useAuth()
  const { updateProgress } = useLearningProgress()
  
  // 🎮 게임 상태 관리
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
  const accuracyRate = correctWords.size === 0 ? 0 : Math.round((correctWords.size / studiedWords.size) * 100)

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
    <div className="min-h-screen full-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden">
      {/* 🌌 TikTok 스타일 배경 */}
      <div className="absolute inset-0">
        {/* 동적 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-blue-600/30 animate-pulse"></div>
        
        {/* 파티클 효과 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '-2s'}}></div>
        
        {/* 네온 그리드 */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/* 🎮 게이밍 UI 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* TikTok 스타일 상단 바 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="immersive-card px-6 py-3 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-6 w-6 text-yellow-400" />
                <div>
                  <div className="text-white font-black text-lg">{sessionXP}</div>
                  <div className="text-white/60 text-xs font-bold">TOTAL XP</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="immersive-card px-6 py-3 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="h-6 w-6 text-orange-400 streak-fire" />
                <div>
                  <div className="text-white font-black text-lg">{streak}</div>
                  <div className="text-white/60 text-xs font-bold">COMBO</div>
                </div>
              </motion.div>
            </div>
            
            {/* 실시간 통계 클러스터 */}
            <div className="flex items-center space-x-3">
              <div className="immersive-card px-4 py-2">
                <Timer className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <div className="text-white font-bold text-sm text-center">{formatTime(timeElapsed)}</div>
              </div>
              
              <div className="immersive-card px-4 py-2">
                <Target className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <div className="text-white font-bold text-sm text-center">{accuracyRate}%</div>
              </div>
            </div>
          </div>

          {/* 혁신적 진행률 표시 */}
          <div className="immersive-card p-6 neon-glow-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">{currentIndex + 1}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">카드 #{currentIndex + 1}</h2>
                  <p className="text-white/70 font-medium">of {totalWords} total</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-black text-gradient-gaming">{Math.round(progress)}%</div>
                <p className="text-white/70 text-sm font-semibold">완료율</p>
              </div>
            </div>
            
            {/* XP 진행 바 */}
            <div className="relative">
              <div className="xp-bar w-full" style={{height: '12px'}}></div>
              <div className="xp-bar" style={{width: `${progress}%`, height: '12px'}}></div>
            </div>
          </div>
        </motion.div>

        {/* 🎴 혁신적 TikTok 스타일 플래시카드 */}
        <div className="mx-auto max-w-lg">
          <motion.div className="relative perspective-2000 mb-8">
            <motion.div
              key={currentIndex}
              initial={{ 
                scale: 0.8, 
                rotateY: -90, 
                opacity: 0,
                y: 100
              }}
              animate={{ 
                scale: 1, 
                rotateY: 0, 
                opacity: 1,
                y: 0
              }}
              exit={{
                scale: 0.8,
                rotateY: 90,
                opacity: 0,
                y: -100
              }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="preserve-3d"
            >
              {/* 🎨 홀로그램 플래시카드 */}
              <motion.div
                className="flashcard-3d min-h-[600px] immersive-card neon-glow-primary relative overflow-hidden cursor-pointer"
                onClick={handleFlip}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: isFlipped ? 185 : 5,
                  rotateX: 5
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 배경 애니메이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
                
                {/* 네온 보더 */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1">
                  <div className="w-full h-full rounded-3xl bg-black/90 backdrop-blur-xl"></div>
                </div>
                
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: "backInOut" }}
                  className="preserve-3d w-full h-full relative z-10"
                >
                  {/* 🎯 앞면 - 단어 (TikTok 스타일) */}
                  <div className={cn(
                    "flashcard-face",
                    isFlipped && "invisible"
                  )}>
                    <div className="flex flex-col items-center justify-center h-[600px] p-8 text-center relative">
                      {/* 난이도 배지 */}
                      <motion.div 
                        className="mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full neon-glow-accent">
                          {currentWord.difficulty === 'basic' ? '🟢 EASY' : 
                           currentWord.difficulty === 'intermediate' ? '🟡 MEDIUM' : '🔴 HARD'}
                        </Badge>
                      </motion.div>
                      
                      {/* 메인 단어 */}
                      <motion.div
                        className="mb-12"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          delay: 0.5,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <h2 className="text-7xl font-black text-gradient-primary mb-6 animate-float">
                          {currentWord.word}
                        </h2>
                        <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
                        <p className="text-2xl text-white/80 font-mono font-bold">
                          {currentWord.pronunciation}
                        </p>
                      </motion.div>
                      
                      {/* 발음 버튼 */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            playPronunciation()
                          }}
                          className="btn-gaming h-16 px-8 text-lg font-bold rounded-2xl mb-8"
                        >
                          <Volume2 className="h-6 w-6 mr-3" />
                          🔊 PLAY SOUND
                        </Button>
                      </motion.div>
                      
                      {/* 힌트 */}
                      <motion.div 
                        animate={{ 
                          opacity: [0.4, 1, 0.4],
                          y: [0, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="immersive-card px-6 py-3">
                          <p className="text-white/70 font-semibold text-center">
                            💡 TAP TO REVEAL
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* 🌟 뒷면 - 뜻과 예문 (Netflix 스타일) */}
                  <div className={cn(
                    "flashcard-face rotateY-180",
                    !isFlipped && "invisible"
                  )}>
                    <div className="flex flex-col justify-center h-[600px] p-8 relative">
                      {/* 메인 뜻 */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-12"
                      >
                        <h3 className="text-6xl font-black text-gradient-gaming mb-6">
                          {currentWord.meaning}
                        </h3>
                        <div className="w-24 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
                      </motion.div>
                      
                      {/* 예문 섹션 */}
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="immersive-card p-8 mb-8 border-l-8 border-gradient-to-b from-purple-500 to-pink-500"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">💬</span>
                          </div>
                          <h4 className="text-2xl font-bold text-white">EXAMPLE</h4>
                        </div>
                        
                        <blockquote className="text-white text-xl font-medium italic mb-6 leading-relaxed border-l-4 border-purple-400 pl-6">
                          &ldquo;{currentWord.example}&rdquo;
                        </blockquote>
                        
                        <p className="text-white/80 text-lg font-medium">
                          {currentWord.exampleTranslation}
                        </p>
                      </motion.div>
                      
                      {/* 다시 보기 힌트 */}
                      <motion.div 
                        animate={{ 
                          opacity: [0.4, 1, 0.4],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity 
                        }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="immersive-card px-6 py-3">
                          <p className="text-white/70 font-semibold text-center">
                            🔄 TAP TO FLIP BACK
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 🎮 TikTok 스타일 액션 버튼 (뒷면일 때만) */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex gap-6 mb-8"
              >
                {/* 모르겠어요 버튼 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateZ: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    onClick={handleDontKnow}
                    className="w-full h-20 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white font-black text-xl rounded-3xl shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <XCircle className="h-8 w-8 mr-4" />
                    <div className="relative z-10">
                      <div className="text-2xl">❌</div>
                      <div className="text-sm font-bold">SKIP</div>
                    </div>
                  </Button>
                </motion.div>

                {/* 알고 있어요 버튼 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateZ: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    onClick={handleKnow}
                    className="w-full h-20 bg-gradient-to-r from-green-500 via-emerald-600 to-blue-600 hover:from-green-600 hover:via-emerald-700 hover:to-blue-700 text-white font-black text-xl rounded-3xl shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <CheckCircle className="h-8 w-8 mr-4" />
                    <div className="relative z-10">
                      <div className="text-2xl">✅</div>
                      <div className="text-sm font-bold">KNEW IT</div>
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎯 혁신적 네비게이션 컨트롤 */}
          <div className="flex justify-between items-center">
            {/* 이전 버튼 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePrevious}
                className="h-16 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 mr-2" />
                PREV
              </Button>
            </motion.div>

            {/* 중앙 컨트롤 */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotateZ: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  onClick={() => setIsFlipped(false)}
                  className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-2xl shadow-lg"
                  title="Reset Flip"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={shuffleCards}
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg"
                  title="Shuffle"
                >
                  <Shuffle className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            {/* 다음 버튼 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleNext}
                className="h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg"
              >
                NEXT
                <ChevronRight className="h-6 w-6 ml-2" />
              </Button>
            </motion.div>
          </div>

          {/* 🏆 TikTok 스타일 실적 대시보드 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                icon: <Target className="h-12 w-12" />,
                value: studiedWords.size,
                label: "STUDIED",
                gradient: "from-blue-500 via-blue-600 to-indigo-600",
                glow: "neon-glow-primary",
                emoji: "🎯"
              },
              {
                icon: <Star className="h-12 w-12 achievement-glow" />,
                value: correctWords.size,
                label: "CORRECT",
                gradient: "from-green-500 via-emerald-600 to-teal-600",
                glow: "neon-glow-accent",
                emoji: "⭐"
              },
              {
                icon: <Zap className="h-12 w-12" />,
                value: sessionXP,
                label: "XP GAINED",
                gradient: "from-yellow-500 via-orange-500 to-red-500",
                glow: "neon-glow-primary",
                emoji: "🚀"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  rotateX: 5
                }}
                className={`immersive-card p-8 text-center cursor-pointer relative overflow-hidden ${stat.glow}`}
              >
                {/* 홀로그램 배경 효과 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* 아이콘과 이모지 */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl ml-3 animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                      {stat.emoji}
                    </div>
                  </div>
                  
                  {/* 수치 */}
                  <div className="text-5xl font-black text-gradient-primary mb-3">
                    {stat.value}
                  </div>
                  
                  {/* 라벨 */}
                  <div className="text-white/80 font-bold text-sm tracking-wider">
                    {stat.label}
                  </div>
                  
                  {/* 진동 효과 */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 🎉 성취도 인사이트 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="immersive-card p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-black text-gradient-gaming mb-6">
                🎯 SESSION INSIGHTS
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-black text-gradient-primary">{accuracyRate}%</div>
                  <div className="text-white/70 font-semibold text-sm">ACCURACY</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-gradient-gaming">{Math.round(timeElapsed/60)}m</div>
                  <div className="text-white/70 font-semibold text-sm">TIME SPENT</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-gradient-primary">{streak}</div>
                  <div className="text-white/70 font-semibold text-sm">MAX COMBO</div>
                </div>
              </div>
              
              {/* 격려 메시지 */}
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-400/30"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                    "0 0 40px rgba(236, 72, 153, 0.4)",
                    "0 0 20px rgba(168, 85, 247, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-white/90 font-semibold text-lg">
                  {accuracyRate >= 80 ? 
                    "🔥 INCREDIBLE! You're mastering these words!" :
                    accuracyRate >= 60 ?
                    "💪 GREAT PROGRESS! Keep pushing forward!" :
                    "🚀 EVERY ATTEMPT COUNTS! You're improving!"
                  }
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}