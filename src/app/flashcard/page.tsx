'use client'

import { useState } from 'react'
import { VocabCard } from '@/components/VocabCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { vocabData } from '@/data/vocab-data'
import Link from 'next/link'

export default function FlashcardPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [studiedWords, setStudiedWords] = useState<Set<number>>(new Set())

  const currentWord = vocabData[currentIndex]
  const totalWords = vocabData.length

  const handleNext = () => {
    setStudiedWords(prev => new Set(prev).add(currentWord.id))
    setCurrentIndex((prev) => (prev + 1) % totalWords)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords)
  }

  const progress = (studiedWords.size / totalWords) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">📚 고등 어휘 마스터</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">홈</Link>
            <Link href="/flashcard" className="text-sm font-medium text-primary">플래시카드</Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary transition-colors">퀴즈</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">로그인</Button>
            <Button size="sm">회원가입</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">학습 진행상황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>진행률: {progress.toFixed(1)}%</span>
                  <span>{currentIndex + 1} / {totalWords}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>학습한 단어: {studiedWords.size}개</span>
                  <span>남은 단어: {totalWords - studiedWords.size}개</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flashcard Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">플래시카드 학습</h1>
            <p className="text-gray-600">카드를 클릭하면 뜻을 확인할 수 있습니다</p>
          </div>

          <VocabCard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← 이전 단어
            </Button>
            <Button onClick={handleNext}>
              다음 단어 →
            </Button>
          </div>

          {/* Word Navigation */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 mr-4">단어 선택:</span>
            {vocabData.slice(Math.max(0, currentIndex - 5), Math.min(totalWords, currentIndex + 6)).map((word, idx) => {
              const wordIndex = Math.max(0, currentIndex - 5) + idx
              return (
                <Button
                  key={word.id}
                  variant={wordIndex === currentIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentIndex(wordIndex)}
                  className={`w-8 h-8 p-0 ${
                    studiedWords.has(word.id) ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
                  }`}
                >
                  {wordIndex + 1}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}