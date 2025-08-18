'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, profile, loading, signOut } = useAuth()
  
  // 디버깅용 상태 확인
  console.log('🎯 Home component render:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    loading,
    profileLoaded: !!profile 
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">📚 고등 어휘 마스터</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">홈</Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">대시보드</Link>
            )}
            <Link href="/flashcard" className="text-sm font-medium hover:text-primary transition-colors">플래시카드</Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary transition-colors">퀴즈</Link>
          </nav>
          <div className="flex items-center gap-2">
            {/* 디버깅 정보 표시 */}
            <div className="text-xs bg-yellow-100 px-2 py-1 rounded mr-2">
              Debug: {loading ? 'Loading...' : user ? `Logged: ${user.email}` : 'Not logged'}
            </div>
            
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : user ? (
              <>
                {profile?.avatar_url && (
                  <img src={profile.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm font-medium">{profile?.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>로그아웃</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">로그인</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            고등학교 필수 어휘를
            <span className="text-primary block">쉽고 재미있게</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI 기반 학습 시스템으로 체계적이고 효과적인 영어 어휘 학습을 시작하세요.
            플래시카드, 퀴즈, 진도 관리까지 모든 기능을 제공합니다.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-3">
                    📊 대시보드로 이동
                  </Button>
                </Link>
                <Link href="/flashcard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    📚 학습 계속하기
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="text-lg px-8 py-3">
                    📚 지금 시작하기
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    🧠 퀴즈 체험하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          왜 고등 어휘 마스터인가요?
        </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📱 <span>스마트 학습</span>
              </CardTitle>
              <CardDescription>
                AI가 분석한 개인별 맞춤 학습 경로
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                개인의 학습 패턴을 분석하여 가장 효과적인 학습 순서와 복습 주기를 제공합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 <span>체계적 관리</span>
              </CardTitle>
              <CardDescription>
                레벨별, 카테고리별 단계적 학습
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                초급부터 고급까지 단계별로 구성된 3000+ 필수 어휘를 체계적으로 학습할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 <span>진도 추적</span>
              </CardTitle>
              <CardDescription>
                실시간 학습 진도와 성취도 분석
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                학습 통계, 정답률, 복습이 필요한 단어들을 한눈에 확인하고 관리할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">지금 시작하세요!</h3>
          <p className="text-xl mb-8 opacity-90">
            무료로 고등학교 필수 어휘 3000개를 마스터하세요
          </p>
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                대시보드로 이동 →
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                무료 학습 시작하기 →
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 고등 어휘 마스터. AI 기반 영어 어휘 학습 플랫폼
          </p>
        </div>
      </footer>
    </div>
  )
}
