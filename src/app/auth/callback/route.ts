import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // 디버깅을 위한 임시 HTML 응답
  if (!code) {
    return new Response(`
      <html>
        <body>
          <h1>OAuth Callback Debug</h1>
          <p><strong>URL:</strong> ${request.url}</p>
          <p><strong>Code:</strong> ${code || 'MISSING'}</p>
          <p><strong>Search Params:</strong> ${Array.from(searchParams.entries()).map(([k,v]) => `${k}=${v}`).join(', ')}</p>
          <p><strong>Supabase URL:</strong> ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing'}</p>
          <p><strong>Supabase Key:</strong> ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing'}</p>
          <a href="/auth/login">Back to Login</a>
        </body>
      </html>
    `, { headers: { 'content-type': 'text/html' } })
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      return new Response(`
        <html>
          <body>
            <h1>OAuth Exchange Error</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Code:</strong> ${code}</p>
            <a href="/auth/login">Back to Login</a>
          </body>
        </html>
      `, { headers: { 'content-type': 'text/html' } })
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}