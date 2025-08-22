'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Brain, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/learn', icon: BookOpen, label: '학습' },
  { href: '/quiz', icon: Brain, label: '퀴즈' },
  { href: '/achievements', icon: Trophy, label: '업적' },
  { href: '/dashboard', icon: User, label: '내정보' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}