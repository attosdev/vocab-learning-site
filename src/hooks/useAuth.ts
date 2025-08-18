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
      console.log('🔍 Auth callback started')
      console.log('Current URL:', window.location.href)
      console.log('Hash:', window.location.hash)
      console.log('Search params:', window.location.search)
      
      // URL 쿼리 파라미터에서도 토큰 확인
      const urlParams = new URLSearchParams(window.location.search)
      const codeParam = urlParams.get('code')
      const errorParam = urlParams.get('error')
      
      console.log('🔍 URL params:', { code: !!codeParam, error: errorParam })
      
      const hash = window.location.hash
      console.log('🔍 Hash analysis:', { 
        hasHash: !!hash, 
        hasAccessToken: hash.includes('access_token'),
        hashLength: hash.length 
      })
      
      if (hash && hash.includes('access_token')) {
        try {
          // 해시에서 토큰 정보 추출
          const hashParams = new URLSearchParams(hash.substr(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          console.log('🔑 Extracted tokens:', { 
            accessToken: !!accessToken, 
            refreshToken: !!refreshToken,
            accessTokenLength: accessToken?.length,
            fullHash: hash 
          })
          
          if (accessToken) {
            try {
              // 토큰을 직접 디코딩해서 사용자 정보 추출
              const payload = JSON.parse(atob(accessToken.split('.')[1]))
              console.log('🎯 Token payload:', payload)
              
              // 사용자 객체 생성
              const user = {
                id: payload.sub,
                email: payload.email,
                user_metadata: payload.user_metadata || {},
                app_metadata: payload.app_metadata || {},
                aud: payload.aud,
                role: payload.role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              // localStorage에 토큰 저장
              localStorage.setItem('supabase_access_token', accessToken)
              if (refreshToken) {
                localStorage.setItem('supabase_refresh_token', refreshToken)
              }
              
              setUser(user as User)
              
              // Supabase 클라이언트에 세션 설정 시도
              try {
                const session = {
                  access_token: accessToken,
                  refresh_token: refreshToken || '',
                  expires_in: 3600,
                  expires_at: payload.exp,
                  token_type: 'bearer',
                  user: user
                }
                
                // 세션 수동 설정
                await supabase.auth.setSession(session as any)
                console.log('✅ Session set manually')
              } catch (sessionError) {
                console.log('Manual session setting failed, continuing with direct API calls')
              }
              
              await fetchProfile(user.id)
              console.log('✅ User set from token:', user.email)
              console.log('User object:', user)
              
              // 성공 표시를 위한 임시 알림
              setTimeout(() => {
                if (window.confirm(`로그인 성공! ${user.email}로 로그인되었습니다. 확인을 누르면 페이지가 새로고침됩니다.`)) {
                  window.location.reload()
                }
              }, 1000)
              
              // URL 정리
              window.history.replaceState({}, document.title, window.location.pathname)
              setLoading(false)
              return
            } catch (tokenError) {
              console.error('Token decoding error:', tokenError)
            }
          }
        } catch (error) {
          console.error('Token processing error:', error)
        }
      }
      
      // localStorage에서 토큰 복원 시도
      const savedToken = localStorage.getItem('supabase_access_token')
      if (savedToken) {
        try {
          const payload = JSON.parse(atob(savedToken.split('.')[1]))
          
          // 토큰 만료 확인
          if (payload.exp > Date.now() / 1000) {
            const user = {
              id: payload.sub,
              email: payload.email,
              user_metadata: payload.user_metadata || {},
              app_metadata: payload.app_metadata || {},
              aud: payload.aud,
              role: payload.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            setUser(user as User)
            await fetchProfile(user.id)
            console.log('User restored from localStorage:', user.email)
            setLoading(false)
            return
          } else {
            // 만료된 토큰 제거
            localStorage.removeItem('supabase_access_token')
            localStorage.removeItem('supabase_refresh_token')
          }
        } catch (error) {
          console.error('Token restoration error:', error)
          localStorage.removeItem('supabase_access_token')
          localStorage.removeItem('supabase_refresh_token')
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
      // localStorage에서 토큰 가져오기
      const accessToken = localStorage.getItem('supabase_access_token')
      
      if (!accessToken) {
        console.log('No access token found for profile fetch')
        return
      }
      
      console.log('🔍 Fetching profile with token...')
      
      // 직접 API 호출
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_profiles?select=*&id=eq.${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        console.error('Profile fetch failed:', response.status, response.statusText)
        return
      }
      
      const data = await response.json()
      console.log('✅ Profile fetched:', data)
      
      if (data && data.length > 0) {
        setProfile(data[0])
      } else {
        console.log('Profile not found, will be created by trigger')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
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
    // localStorage 정리
    localStorage.removeItem('supabase_access_token')
    localStorage.removeItem('supabase_refresh_token')
    
    // Supabase 로그아웃
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    
    // 상태 초기화
    setUser(null)
    setProfile(null)
  }

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut
  }
}