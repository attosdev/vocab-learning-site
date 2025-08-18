'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { useAuth } from '@/hooks/useAuth'
import { Toaster } from '@/components/ui/sonner'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 경우 전체 화면 레이아웃
  if (!user) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // 로그인한 경우 사이드바/바텀네비 레이아웃
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        {/* Main Content */}
        <SidebarInset className="flex-1">
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
        </SidebarInset>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
      <Toaster />
    </SidebarProvider>
  )
}