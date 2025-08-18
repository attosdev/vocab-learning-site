import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('Callback URL:', request.url)
  console.log('Code:', code)
  console.log('Environment check:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing'
  })

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Exchange result:', { success: !error, error: error?.message })
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 오류 발생 시 로그인 페이지로 리다이렉트
  console.log('Redirecting to login due to error')
  return NextResponse.redirect(`${origin}/auth/login`)
}