'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fetchWordPack, fetchWordsByPack, WordPack, Word } from '@/lib/supabase'
import { useVocabStore } from '@/lib/store'
import {
  BookOpen,
  Play,
  Brain,
  Shuffle,
  Clock,
  Target,
  ChevronLeft,
  Star,
  TrendingUp,
} from 'lucide-react'

export default function PackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [pack, setPack] = useState<WordPack | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const { startSession, srsProgress, getWordsForReview } = useVocabStore()

  useEffect(() => {
    async function loadPackData() {
      try {
        const [packData, wordsData] = await Promise.all([
          fetchWordPack(slug),
          fetchWordsByPack(slug, 100),
        ])
        
        setPack(packData)
        setWords(wordsData)
      } catch (error) {
        console.error('Failed to load pack data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPackData()
  }, [slug])

  const handleStartStudy = (mode: 'flashcard' | 'quiz' | 'spelling') => {
    if (!pack || words.length === 0) return
    
    // Use all words for now
    const studyWords = words

    if (studyWords.length === 0) {
      alert('복습할 단어가 없습니다!')
      return
    }

    startSession(pack, studyWords, mode)
    router.push(`/study?pack=${slug}&mode=${mode}`)
  }

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

  const getStudyStats = () => {
    const packWordIds = words.map(w => w.id)
    const studiedWords = packWordIds.filter(id => srsProgress[id])
    const masteredWords = studiedWords.filter(id => srsProgress[id] && srsProgress[id].reps >= 3)
    const reviewWords = getWordsForReview().filter(id => packWordIds.includes(id))

    return {
      total: words.length,
      studied: studiedWords.length,
      mastered: masteredWords.length,
      review: reviewWords.length,
      progress: words.length > 0 ? Math.round((studiedWords.length / words.length) * 100) : 0,
    }
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

  if (!pack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">단어팩을 찾을 수 없습니다</h1>
          <Button onClick={() => router.push('/')} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const levelInfo = getLevelInfo(pack.level)
  const stats = getStudyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 mr-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </motion.div>

        {/* Pack Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white font-medium`}>
                  <span className="mr-2">{levelInfo.emoji}</span>
                  {levelInfo.label}
                </div>
                <div className="text-3xl">{levelInfo.emoji}</div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{pack.title}</h1>
              <p className="text-slate-300 text-lg mb-6">{pack.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-sm text-slate-400">총 단어</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.studied}</div>
                  <div className="text-sm text-slate-400">학습 완료</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.mastered}</div>
                  <div className="text-sm text-slate-400">마스터</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.review}</div>
                  <div className="text-sm text-slate-400">복습 예정</div>
                </div>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
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
                    strokeDasharray={`${stats.progress * 2.51} ${(100 - stats.progress) * 2.51}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.progress}%</div>
                    <div className="text-xs text-slate-400">진행률</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Modes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">학습 모드 선택</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                mode: 'flashcard' as const,
                icon: <BookOpen className="w-8 h-8" />,
                title: '플래시카드',
                description: '단어와 뜻을 번갈아 보며 학습',
                color: 'from-blue-600 to-purple-600',
                time: '15-20분',
              },
              {
                mode: 'quiz' as const,
                icon: <Brain className="w-8 h-8" />,
                title: '퀴즈',
                description: '객관식 문제로 실력 테스트',
                color: 'from-purple-600 to-pink-600',
                time: '10-15분',
              },
              {
                mode: 'spelling' as const,
                icon: <Target className="w-8 h-8" />,
                title: '스펠링',
                description: '듣고 철자 입력하기',
                color: 'from-pink-600 to-red-600',
                time: '20-25분',
              },
            ].map((studyMode, index) => (
              <motion.div
                key={studyMode.mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer group"
                onClick={() => handleStartStudy(studyMode.mode)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${studyMode.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {studyMode.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{studyMode.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{studyMode.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {studyMode.time}
                  </div>
                  <Button size="sm" className={`bg-gradient-to-r ${studyMode.color} hover:opacity-90`}>
                    <Play className="w-4 h-4 mr-2" />
                    시작
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          {stats.review > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30 text-center"
            >
              <h3 className="text-xl font-bold text-white mb-2">복습이 필요한 단어가 있습니다!</h3>
              <p className="text-orange-200 mb-4">
                {stats.review}개의 단어가 복습을 기다리고 있어요
              </p>
              <Button
                onClick={() => handleStartStudy('flashcard')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                지금 복습하기
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Word Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">단어 미리보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.slice(0, 6).map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{word.term}</h4>
                  {srsProgress[word.id] && srsProgress[word.id].reps >= 3 && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
                <p className="text-slate-300 text-sm">{word.meaning_ko}</p>
                {word.phonetic && (
                  <p className="text-slate-400 text-xs mt-1 font-mono">{word.phonetic}</p>
                )}
              </motion.div>
            ))}
          </div>
          
          {words.length > 6 && (
            <p className="text-center text-slate-400 mt-4">
              ...그리고 {words.length - 6}개 더
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}