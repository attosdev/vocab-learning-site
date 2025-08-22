'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Word } from '@/lib/supabase'
import { TTSManager } from '@/lib/tts'
import { useVocabStore } from '@/lib/store'
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface StudyCardProps {
  word: Word
  onAnswer: (quality: number) => void
  onNext: () => void
  onPrevious: () => void
  canNavigate: { prev: boolean; next: boolean }
  showAnswer: boolean
  onToggleAnswer: () => void
}

export default function StudyCard({
  word,
  onAnswer,
  onNext,
  onPrevious,
  canNavigate,
  showAnswer,
  onToggleAnswer,
}: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const tts = TTSManager.getInstance()
  const { settings } = useVocabStore()

  // Reset flip state when word changes
  useEffect(() => {
    setIsFlipped(false)
  }, [word.id])

  // Sync flip state with showAnswer
  useEffect(() => {
    setIsFlipped(showAnswer)
  }, [showAnswer])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleFlip()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (canNavigate.prev) onPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          if (canNavigate.next) onNext()
          break
        case '1':
          if (isFlipped) onAnswer(0) // Hard
          break
        case '2':
          if (isFlipped) onAnswer(3) // Good
          break
        case '3':
          if (isFlipped) onAnswer(5) // Easy
          break
        case 'p':
          e.preventDefault()
          playAudio()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, canNavigate, word.id])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onToggleAnswer()
  }

  const playAudio = async () => {
    if (isPlaying) return
    
    setIsPlaying(true)
    try {
      await tts.speakWord(word.term, word.audio_url)
    } catch (error) {
      console.error('TTS failed:', error)
    } finally {
      setIsPlaying(false)
    }
  }

  // Touch/Mouse handlers
  const handleStart = (clientX: number) => {
    setStartX(clientX)
    setCurrentX(clientX)
    setIsDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging) return
    
    const deltaX = currentX - startX
    const threshold = 100

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && canNavigate.prev) {
        onPrevious()
      } else if (deltaX < 0 && canNavigate.next) {
        onNext()
      }
    }

    setIsDragging(false)
    setCurrentX(0)
    setStartX(0)
  }

  const dragOffset = isDragging ? currentX - startX : 0
  const dragOpacity = Math.max(0.7, 1 - Math.abs(dragOffset) / 200)

  const handleAnswer = (quality: number) => {
    onAnswer(quality)
    // Add a small delay before moving to next card
    setTimeout(() => {
      if (canNavigate.next) {
        onNext()
      }
    }, 300)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4">
      {/* Navigation hints */}
      <div className="flex items-center justify-between w-full mb-4 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          {canNavigate.prev && (
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd>
          <span className="ml-2">뒤집기</span>
        </div>
        <div className="flex items-center space-x-2">
          {canNavigate.next && (
            <div className="flex items-center">
              <span>다음</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main card */}
      <motion.div
        ref={cardRef}
        className="relative w-full h-96 cursor-pointer perspective-1000"
        style={{
          transform: `translateX(${dragOffset}px)`,
          opacity: dragOpacity,
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
        }}
        onClick={handleFlip}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Front side - Term */}
        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ transform: 'rotateY(0deg)' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {word.term}
              </h2>
              {word.phonetic && (
                <p className="text-lg text-purple-200 font-mono">
                  {word.phonetic}
                </p>
              )}
              {word.pos && (
                <span className="inline-block mt-3 px-3 py-1 bg-white/10 rounded-full text-sm text-slate-300">
                  {word.pos}
                </span>
              )}
            </div>

            {/* Audio button */}
            <Button
              onClick={(e) => {
                e.stopPropagation()
                playAudio()
              }}
              disabled={isPlaying}
              className="mb-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              size="lg"
            >
              {isPlaying ? (
                <VolumeX className="w-5 h-5 mr-2" />
              ) : (
                <Volume2 className="w-5 h-5 mr-2" />
              )}
              {isPlaying ? '재생 중...' : '발음 듣기'}
            </Button>

            <div className="text-slate-300 text-center">
              <p className="mb-2">카드를 클릭하거나 <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd>를 눌러 답을 확인하세요</p>
              <p className="text-sm">← → 화살표 키로 이동</p>
            </div>
          </div>
        </motion.div>

        {/* Back side - Meaning */}
        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {word.meaning_ko}
              </h3>
              {word.meaning_en && (
                <p className="text-lg text-green-200 mb-4">
                  {word.meaning_en}
                </p>
              )}
              
              {/* Examples */}
              {word.examples && word.examples.length > 0 && (
                <div className="mt-6 space-y-3">
                  {word.examples.slice(0, 2).map((example, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 text-left">
                      <p className="text-white mb-1">{example.en}</p>
                      <p className="text-slate-300 text-sm">{example.ko}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty rating buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnswer(0)
                }}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-200 flex-1"
                size="lg"
              >
                <Target className="w-4 h-4 mr-2" />
                어려움
                <div className="text-xs mt-1">1</div>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnswer(3)
                }}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-200 flex-1"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                보통
                <div className="text-xs mt-1">2</div>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnswer(5)
                }}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-200 flex-1"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                쉬움
                <div className="text-xs mt-1">3</div>
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              숫자 키 1, 2, 3으로도 선택 가능
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Swipe indicators */}
      {isDragging && (
        <div className="mt-4 flex items-center space-x-4 text-slate-400">
          {dragOffset > 50 && canNavigate.prev && (
            <div className="flex items-center text-blue-400">
              <ChevronLeft className="w-5 h-5" />
              <span>이전 카드</span>
            </div>
          )}
          {dragOffset < -50 && canNavigate.next && (
            <div className="flex items-center text-blue-400">
              <span>다음 카드</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}