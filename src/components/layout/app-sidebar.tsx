'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  BookOpen,
  Brain,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  Target,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  {
    title: '홈',
    icon: Home,
    href: '/',
    badge: null,
  },
  {
    title: '학습하기',
    icon: BookOpen,
    href: '/learn',
    badge: 'NEW',
  },
  {
    title: '플래시카드',
    icon: Zap,
    href: '/flashcard',
    badge: null,
  },
  {
    title: '퀴즈',
    icon: Brain,
    href: '/quiz',
    badge: null,
  },
  {
    title: '내 진도',
    icon: BarChart3,
    href: '/dashboard',
    badge: null,
  },
  {
    title: '업적',
    icon: Trophy,
    href: '/achievements',
    badge: '3',
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  // Mock data - 실제로는 Supabase에서 가져와야 함
  const streakDays = 7
  const todayProgress = 65
  const level = 5
  const exp = 1250
  const nextLevelExp = 2000

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {level}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{profile?.name || user?.email?.split('@')[0]}</p>
            <div className="mt-1">
              <Progress value={(exp / nextLevelExp) * 100} className="h-1.5" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {exp} / {nextLevelExp} XP
              </p>
            </div>
          </div>
        </div>

        {/* Streak and Daily Goal */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-3">
          <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-2 py-1.5 dark:bg-orange-950/20">
            <Flame className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs font-semibold text-orange-900 dark:text-orange-400">
                {streakDays}일 연속
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2 py-1.5 dark:bg-blue-950/20">
            <Target className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-400">
                오늘 {todayProgress}%
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="relative"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === 'NEW' ? 'default' : 'secondary'}
                          className="ml-auto h-5 px-1.5 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>설정</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}