'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, UserProfile } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // URL에서 토큰 처리 (implicit flow)
    const handleAuthCallback = async () => {
      console.log('Current URL:', window.location.href)
      console.log('Hash:', window.location.hash)
      
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        try {
          // 해시에서 토큰 정보 추출
          const hashParams = new URLSearchParams(hash.substr(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          console.log('Extracted tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken })
          
          if (accessToken && refreshToken) {
            // URL에서 토큰을 가져와서 세션 설정
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            console.log('SetSession result:', { success: !error, error: error?.message })
            
            if (!error && data.session) {
              setUser(data.session.user)
              await fetchProfile(data.session.user.id)
              console.log('User set:', data.session.user.email)
              
              // URL 정리
              window.history.replaceState({}, document.title, window.location.pathname)
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Token processing error:', error)
        }
      }
      
      // 일반 세션 확인
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Regular session check:', !!session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    handleAuthCallback()

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut
  }
}