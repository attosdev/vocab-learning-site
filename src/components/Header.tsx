import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          📚 고등 어휘 마스터
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            홈
          </Link>
          <Link href="/flashcard" className="text-sm font-medium hover:text-primary transition-colors">
            플래시카드
          </Link>
          <Link href="/quiz" className="text-sm font-medium hover:text-primary transition-colors">
            퀴즈
          </Link>
          <Link href="/progress" className="text-sm font-medium hover:text-primary transition-colors">
            진도현황
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            로그인
          </Button>
          <Button size="sm">
            회원가입
          </Button>
        </div>
      </div>
    </header>
  )
}