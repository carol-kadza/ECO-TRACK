

// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { DashboardSidebar } from '@/components/dashboard/sidebar'
// import { DashboardHeader } from '@/components/dashboard/header'
// import { useAuth } from '@/lib/auth-context'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const { user, loading } = useAuth()
//   const [collapsed, setCollapsed] = useState(false)
//   const [mobileOpen, setMobileOpen] = useState(false)

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login')
//     }
//   }, [user, loading, router])

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
//           <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar - desktop */}
//       <div className="hidden lg:block">
//         <DashboardSidebar
//           collapsed={collapsed}
//           onToggle={() => setCollapsed(!collapsed)}
//         />
//       </div>

//       {/* Sidebar - mobile */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${
//           mobileOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <DashboardSidebar
//           collapsed={false}
//           onToggle={() => setMobileOpen(false)}
//         />
//       </div>

//       {/* Main content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <DashboardHeader onMenuClick={() => setMobileOpen(!mobileOpen)} />
//         <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Safety net: if user somehow has no business record (skipped onboarding,
  // or old account before this fix), create one automatically
  useEffect(() => {
    if (!user) return
    const ensureBusiness = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!data) {
        await supabase.from('businesses').insert({
          user_id: user.id,
          name: user.email?.split('@')[0] || 'My Business',
          business_type: 'other',
          location: null,
        })
      }
    }
    ensureBusiness()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="hidden lg:block">
        <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <DashboardSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}