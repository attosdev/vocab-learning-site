'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchWordPacks, WordPack } from '@/lib/supabase'

export default function NewHomePage() {
  const [wordPacks, setWordPacks] = useState<WordPack[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const getLevelStyle = (level: string) => {
    const styles = {
      beginner: 'bg-green-500 text-white',
      intermediate: 'bg-blue-500 text-white', 
      advanced: 'bg-purple-500 text-white',
      exam: 'bg-orange-500 text-white',
      topic: 'bg-pink-500 text-white',
    }
    return styles[level as keyof typeof styles] || styles.beginner
  }

  const getLevelEmoji = (level: string) => {
    const emojis = {
      beginner: '🌱',
      intermediate: '🌊',
      advanced: '🚀', 
      exam: '🎯',
      topic: '📚',
    }
    return emojis[level as keyof typeof emojis] || '🌱'
  }

  const getLevelLabel = (level: string) => {
    const labels = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
      exam: '시험',
      topic: '주제별',
    }
    return labels[level as keyof typeof labels] || '초급'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="text-center py-16 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
          <span className="text-2xl">🧠</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Vocab<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Master</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          스마트한 반복 학습으로 영어 단어를 효과적으로 마스터하세요
        </p>
      </header>

      {/* Stats */}
      <div className="flex justify-center mb-16 px-6">
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-slate-300">복습 예정</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">20</div>
            <div className="text-sm text-slate-300">학습 단어</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-slate-300">마스터</div>
          </div>
        </div>
      </div>

      {/* Word Packs */}
      <div className="px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">단어 팩 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {wordPacks.map((pack) => (
            <Link key={pack.id} href={`/study?pack=${pack.slug}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelStyle(pack.level)}`}>
                    {getLevelEmoji(pack.level)} {getLevelLabel(pack.level)}
                  </span>
                  <span className="text-2xl">{getLevelEmoji(pack.level)}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{pack.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{pack.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-400">
                    📚 {pack.total_words} 단어
                  </div>
                  <div className="text-purple-300">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">스마트 학습 시스템</h2>
          <p className="text-slate-300">
            과학적인 SRS 알고리즘과 개인화된 학습 경험으로 효율적인 단어 암기를 지원합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl mb-6">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">스마트 복습</h3>
            <p className="text-slate-300">SRS 알고리즘으로 최적의 복습 타이밍을 제공합니다</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">맞춤형 학습</h3>
            <p className="text-slate-300">개인의 학습 패턴을 분석하여 맞춤형 콘텐츠를 제공합니다</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">진도 추적</h3>
            <p className="text-slate-300">실시간으로 학습 진도와 성취도를 확인할 수 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}