import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Callback route called with URL:', request.url)
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const next = searchParams.get('next') ?? '/'

  console.log('Received params:', { code: !!code, error, next })

  // OAuth 에러가 있는 경우
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${origin}/auth/login?error=${error}`)
  }

  // Authorization code가 있는 경우 (authorization code flow)
  if (code) {
    console.log('Processing authorization code...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      console.log('Code exchange result:', { success: !!data.session, error: error?.message })
      
      if (!error && data.session) {
        console.log('Successful auth, redirecting to:', `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('Code exchange failed:', error)
      }
    } catch (err) {
      console.error('Code exchange exception:', err)
    }
  }

  // Implicit flow인 경우나 에러 발생 시 메인 페이지로 리다이렉트
  // (클라이언트에서 URL 해시의 토큰을 처리하도록)
  console.log('No code or exchange failed, redirecting to home for client-side token processing')
  return NextResponse.redirect(`${origin}/`)
}