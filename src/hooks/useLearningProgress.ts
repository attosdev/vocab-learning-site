'use client'

import { useEffect, useState } from 'react'
import { supabase, LearningProgress, VocabularyWord } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useLearningProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<LearningProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgress()
    } else {
      setProgress([])
      setLoading(false)
    }
  }, [user])

  const fetchProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching progress:', error)
        return
      }

      setProgress(data || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (wordId: number, isCorrect: boolean) => {
    if (!user) return

    try {
      // Supabase 함수 호출
      const { error } = await supabase.rpc('update_learning_progress', {
        p_user_id: user.id,
        p_word_id: wordId,
        p_is_correct: isCorrect
      })

      if (error) {
        console.error('Error updating progress:', error)
        return
      }

      // 진도 다시 불러오기
      await fetchProgress()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getWordProgress = (wordId: number): LearningProgress | null => {
    return progress.find(p => p.word_id === wordId) || null
  }

  const getOverallStats = () => {
    if (progress.length === 0) {
      return {
        totalWords: 0,
        masteredWords: 0,
        averageMastery: 0,
        totalSessions: 0
      }
    }

    const masteredWords = progress.filter(p => p.mastery_level >= 80).length
    const averageMastery = progress.reduce((sum, p) => sum + p.mastery_level, 0) / progress.length
    const totalSessions = progress.reduce((sum, p) => sum + p.correct_count + p.incorrect_count, 0)

    return {
      totalWords: progress.length,
      masteredWords,
      averageMastery: Math.round(averageMastery),
      totalSessions
    }
  }

  const getWeakWords = (limit: number = 5): LearningProgress[] => {
    return [...progress]
      .sort((a, b) => a.mastery_level - b.mastery_level)
      .slice(0, limit)
  }

  const getStrongWords = (limit: number = 5): LearningProgress[] => {
    return [...progress]
      .sort((a, b) => b.mastery_level - a.mastery_level)
      .slice(0, limit)
  }

  return {
    progress,
    loading,
    updateProgress,
    getWordProgress,
    getOverallStats,
    getWeakWords,
    getStrongWords,
    refreshProgress: fetchProgress
  }
}