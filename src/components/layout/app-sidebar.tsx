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

  // 🎮 Enhanced 게이밍 데이터
  const streakDays = 12
  const todayProgress = 78
  const level = 8
  const exp = 2340
  const nextLevelExp = 3000
  const totalXP = 15650
  const rank = "Diamond"

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-pink-900/95 backdrop-blur-xl">
        {/* 🎯 홀로그램 프로필 섹션 */}
        <div className="p-6 space-y-6">
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              <Avatar className="relative h-16 w-16 ring-4 ring-purple-400/30 bg-gradient-to-br from-purple-500 to-pink-500">
                <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-black">
                  {user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* 레벨 배지 */}
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-black text-black shadow-lg">
                {level}
              </div>
              
              {/* 온라인 상태 */}
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-white font-black text-lg leading-tight">
                  {profile?.name || user?.email?.split('@')[0]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-400">{rank}</span>
                  <span className="text-xs text-white/70">Lv.{level}</span>
                </div>
              </div>
              
              {/* XP 진행바 */}
              <div className="space-y-1">
                <div className="xp-bar" style={{width: `${(exp / nextLevelExp) * 100}%`, height: '6px'}}></div>
                <div className="flex justify-between text-[10px] text-white/70 font-semibold">
                  <span>{exp} XP</span>
                  <span>{nextLevelExp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 게이밍 통계 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="immersive-card p-4 text-center">
              <Flame className="h-6 w-6 text-orange-400 mx-auto mb-2 streak-fire" />
              <div className="text-2xl font-black text-white">{streakDays}</div>
              <div className="text-xs font-bold text-white/70">DAY STREAK</div>
            </div>
            
            <div className="immersive-card p-4 text-center">
              <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{todayProgress}%</div>
              <div className="text-xs font-bold text-white/70">TODAY</div>
            </div>
          </div>
          
          {/* 🏆 랭킹 배지 */}
          <div className="immersive-card p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400 achievement-glow" />
              <div>
                <div className="text-white font-black text-lg">{totalXP.toLocaleString()}</div>
                <div className="text-white/70 text-xs font-bold">TOTAL XP</div>
              </div>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-purple-900/50 via-blue-900/50 to-pink-900/50 backdrop-blur-xl">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-bold text-xs tracking-wider mb-4 px-6">
            🎮 GAME MENU
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`
                      relative overflow-hidden rounded-2xl transition-all duration-300 
                      ${pathname === item.href 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105 neon-glow-primary' 
                        : 'hover:bg-white/10 hover:scale-102 text-white/80 hover:text-white'
                      }
                    `}
                  >
                    <Link href={item.href} className="flex items-center gap-4 py-4 px-4">
                      {/* 아이콘 컨테이너 */}
                      <div className={`
                        flex h-10 w-10 items-center justify-center rounded-xl
                        ${pathname === item.href 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/70'
                        }
                      `}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      
                      {/* 메뉴 텍스트 */}
                      <span className="font-bold text-sm flex-1">{item.title}</span>
                      
                      {/* 배지 */}
                      {item.badge && (
                        <Badge 
                          className={`
                            h-6 px-2 text-xs font-black
                            ${item.badge === 'NEW' 
                              ? 'bg-gradient-to-r from-green-400 to-blue-500 text-black animate-pulse' 
                              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                            }
                          `}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      
                      {/* 활성 상태 인디케이터 */}
                      {pathname === item.href && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-l-full"></div>
                      )}
                      
                      {/* 호버 이펙트 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* 🎯 퀵 스탯 섹션 */}
        <div className="px-6 py-4">
          <div className="immersive-card p-4 space-y-3">
            <h3 className="text-white font-bold text-xs tracking-wider mb-3">⚡ QUICK STATS</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70 font-semibold">Words Mastered</span>
                <span className="text-white font-black">156</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70 font-semibold">Accuracy</span>
                <span className="text-green-400 font-black">92%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70 font-semibold">Global Rank</span>
                <span className="text-yellow-400 font-black">#247</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t-0 bg-gradient-to-t from-purple-900/80 via-blue-900/80 to-pink-900/80 backdrop-blur-xl p-4">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 py-3"
            >
              <Link href="/settings" className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-semibold">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={signOut}
              className="rounded-2xl hover:bg-red-500/20 text-white/80 hover:text-red-300 transition-all duration-300 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-semibold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}