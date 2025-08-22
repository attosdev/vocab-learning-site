import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for PRD-based schema
export interface WordPack {
  id: string
  slug: string
  title: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'exam' | 'topic'
  description: string
  total_words: number
  is_published: boolean
  created_at: string
}

export interface Word {
  id: string
  pack_id: string
  term: string
  phonetic?: string
  pos?: string
  meaning_ko: string
  meaning_en?: string
  examples: Array<{ en: string; ko: string }>
  synonyms: string[]
  antonyms: string[]
  audio_url?: string
  tags: string[]
  order_index: number
  created_at: string
}

// API Functions
export async function fetchWordPacks(): Promise<WordPack[]> {
  const { data, error } = await supabase
    .from('word_packs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchWordsByPack(slug: string, limit = 50): Promise<Word[]> {
  const { data: pack } = await supabase
    .from('word_packs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!pack) return []

  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('pack_id', pack.id)
    .order('order_index', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function fetchWordPack(slug: string): Promise<WordPack | null> {
  const { data, error } = await supabase
    .from('word_packs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}