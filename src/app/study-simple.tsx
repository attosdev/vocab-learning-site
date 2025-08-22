'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fetchWordsByPack, Word } from '@/lib/supabase'

export default function SimpleStudyPage() {
  const searchParams = useSearchParams()
  const packSlug = searchParams?.get('pack') || 'basic'
  
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWords() {
      try {
        const wordsData = await fetchWordsByPack(packSlug)
        setWords(wordsData)
      } catch (error) {
        console.error('Failed to load words:', error)
      } finally {
        setLoading(false)
      }
    }
    loadWords()
  }, [packSlug])

  const currentWord = words[currentIndex]

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">단어를 찾을 수 없습니다</h2>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link href="/" className="text-white hover:text-purple-300">
          ← 홈으로
        </Link>
        <div className="text-white text-sm">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 min-h-[400px] flex flex-col justify-center items-center text-center cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-200"
            onClick={handleFlip}
          >
            {!isFlipped ? (
              // Front - Show word
              <div>
                <h2 className="text-5xl font-bold text-white mb-4">{currentWord.term}</h2>
                {currentWord.phonetic && (
                  <p className="text-lg text-purple-200 font-mono mb-4">{currentWord.phonetic}</p>
                )}
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm text-slate-300 mb-6">
                  {currentWord.pos}
                </span>
                <p className="text-slate-300 text-sm">
                  카드를 클릭하여 뜻을 확인하세요
                </p>
              </div>
            ) : (
              // Back - Show meaning and examples
              <div className="w-full">
                <h3 className="text-3xl font-bold text-white mb-4">{currentWord.meaning_ko}</h3>
                {currentWord.meaning_en && (
                  <p className="text-lg text-green-200 mb-6">{currentWord.meaning_en}</p>
                )}
                
                {currentWord.examples && currentWord.examples.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-4 text-left mb-6 w-full">
                    {currentWord.examples.slice(0, 2).map((example: { en: string; ko: string }, index: number) => (
                      <div key={index} className="mb-2">
                        <p className="text-white">{example.en}</p>
                        <p className="text-slate-300 text-sm">{example.ko}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle difficulty */ }}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-200 flex-1 py-3 rounded-xl transition-colors"
                  >
                    어려움
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle difficulty */ }}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-200 flex-1 py-3 rounded-xl transition-colors"
                  >
                    보통
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Handle difficulty */ }}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-200 flex-1 py-3 rounded-xl transition-colors"
                  >
                    쉬움
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            다음
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 text-slate-400 text-sm">
        <p>Space 키로 카드 뒤집기 • 화살표 키로 이동</p>
      </div>
    </div>
  )
}