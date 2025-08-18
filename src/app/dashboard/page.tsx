'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLearningProgress } from '@/hooks/useLearningProgress'

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { loading: progressLoading, getOverallStats, getWeakWords, getStrongWords } = useLearningProgress()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">로딩 중...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = getOverallStats()
  const weakWords = getWeakWords(3)
  const strongWords = getStrongWords(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">📚 고등 어휘 마스터</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">대시보드</Link>
            <Link href="/flashcard" className="text-sm font-medium hover:text-primary transition-colors">플래시카드</Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary transition-colors">퀴즈</Link>
          </nav>
          <div className="flex items-center gap-2">
            {profile?.avatar_url && (
              <Image src={profile.avatar_url} alt="Profile" width={32} height={32} className="rounded-full" />
            )}
            <span className="text-sm font-medium">{profile?.name || user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {profile?.name || '학습자'}님! 👋
          </h1>
          <p className="text-gray-600">오늘도 영어 어휘 학습을 시작해볼까요?</p>
        </div>

        {/* 학습 통계 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary">
                {stats.totalWords}
              </CardTitle>
              <CardDescription>학습한 단어</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {stats.masteredWords}
              </CardTitle>
              <CardDescription>마스터한 단어</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {stats.averageMastery}%
              </CardTitle>
              <CardDescription>평균 숙련도</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {stats.totalSessions}
              </CardTitle>
              <CardDescription>총 학습 횟수</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📚 <span>플래시카드 학습</span>
              </CardTitle>
              <CardDescription>
                카드를 뒤집어가며 단어를 학습하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/flashcard">
                <Button className="w-full">시작하기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧠 <span>퀴즈 도전</span>
              </CardTitle>
              <CardDescription>
                객관식 퀴즈로 실력을 테스트하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/quiz">
                <Button className="w-full">도전하기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 <span>복습하기</span>
              </CardTitle>
              <CardDescription>
                틀린 문제나 어려운 단어를 복습하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/review">
                <Button variant="outline" className="w-full">복습하기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 학습 분석 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 취약한 단어 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">🎯 집중 학습 필요</CardTitle>
              <CardDescription>숙련도가 낮은 단어들입니다</CardDescription>
            </CardHeader>
            <CardContent>
              {weakWords.length > 0 ? (
                <div className="space-y-3">
                  {weakWords.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">단어 ID: {item.word_id}</p>
                        <p className="text-sm text-gray-600">
                          정답: {item.correct_count} / 오답: {item.incorrect_count}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">
                          {Math.round(item.mastery_level)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-3">
                    취약 단어 집중 학습
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  아직 학습 데이터가 없습니다.<br />
                  학습을 시작해보세요!
                </p>
              )}
            </CardContent>
          </Card>

          {/* 잘하는 단어 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🌟 잘 알고 있는 단어</CardTitle>
              <CardDescription>숙련도가 높은 단어들입니다</CardDescription>
            </CardHeader>
            <CardContent>
              {strongWords.length > 0 ? (
                <div className="space-y-3">
                  {strongWords.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">단어 ID: {item.word_id}</p>
                        <p className="text-sm text-gray-600">
                          연속 정답: {item.streak_count}회
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          {Math.round(item.mastery_level)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  학습을 계속하여<br />
                  마스터한 단어를 늘려보세요!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}