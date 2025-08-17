import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface VocabularyWord {
  id: number
  word: string
  definition: string
  pronunciation?: string
  part_of_speech: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  examples: string[]
  synonyms: string[]
  antonyms: string[]
  created_at: string
}

export interface LearningProgress {
  id: string
  user_id: string
  word_id: number
  correct_count: number
  incorrect_count: number
  last_reviewed: string
  mastery_level: number
  streak_count: number
  created_at: string
  updated_at: string
}

export interface QuizSession {
  id: string
  user_id: string
  quiz_type: string
  total_questions: number
  correct_answers: number
  score: number
  started_at: string
  completed_at?: string
  duration_seconds?: number
}

export interface QuizAnswer {
  id: string
  session_id: string
  word_id: number
  user_answer: string
  correct_answer: string
  is_correct: boolean
  response_time_ms?: number
  created_at: string
}

export interface LearningSession {
  id: string
  user_id: string
  session_type: 'flashcard' | 'review' | 'quiz' | 'practice'
  words_studied: number[]
  duration_seconds?: number
  words_learned: number
  started_at: string
  completed_at?: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  description?: string
  earned_at: string
  metadata: Record<string, any>
}