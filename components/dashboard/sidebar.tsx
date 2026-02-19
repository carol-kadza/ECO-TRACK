

// 'use client'

// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { cn } from '@/lib/utils'
// import { EcoTrackLogo } from '@/components/ecotrack-logo'
// import { useAuth } from '@/lib/auth-context'
// import {
//   LayoutDashboard,
//   Package,
//   AlertTriangle,
//   TrendingUp,
//   Settings,
//   HelpCircle,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react'

// const navItems = [
//   { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
//   { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
//   { label: 'Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
//   { label: 'Forecasting', href: '/dashboard/forecasting', icon: TrendingUp },
// ]

// const bottomItems = [
//   { label: 'Settings', href: '/dashboard/settings', icon: Settings },
//   { label: 'Help & Support', href: '/dashboard/help', icon: HelpCircle },
// ]

// function getInitials(email: string): string {
//   const name = email.split('@')[0]
//   const parts = name.split(/[._-]/)
//   if (parts.length >= 2) {
//     return (parts[0][0] + parts[1][0]).toUpperCase()
//   }
//   return name.slice(0, 2).toUpperCase()
// }

// function getDisplayName(user: any): string {
//   if (user?.user_metadata?.full_name) return user.user_metadata.full_name
//   if (user?.user_metadata?.name) return user.user_metadata.name
//   if (user?.email) {
//     const name = user.email.split('@')[0]
//     return name
//       .split(/[._-]/)
//       .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
//       .join(' ')
//   }
//   return 'User'
// }

// export function DashboardSidebar({
//   collapsed,
//   onToggle,
// }: {
//   collapsed: boolean
//   onToggle: () => void
// }) {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { signOut, user } = useAuth()

//   const handleLogout = async () => {
//     try {
//       await signOut()
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       router.push('/login')
//     }
//   }

//   const displayName = user ? getDisplayName(user) : 'User'
//   const initials = user?.email ? getInitials(user.email) : 'U'
//   const email = user?.email || ''

//   return (
//     <aside
//       className={cn(
//         'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
//         collapsed ? 'w-[68px]' : 'w-64'
//       )}
//     >
//       {/* Logo */}
//       <div className="flex items-center justify-between px-4 py-5">
//         {!collapsed && (
//           <EcoTrackLogo
//             size="sm"
//             className="[&_span]:text-sidebar-foreground"
//           />
//         )}
//         <button
//           onClick={onToggle}
//           className="rounded-lg p-2 hover:bg-sidebar-accent text-sidebar-foreground"
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4" />
//           ) : (
//             <ChevronLeft className="h-4 w-4" />
//           )}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
//         {navItems.map((item) => {
//           const Icon = item.icon
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
//                 isActive
//                   ? 'bg-sidebar-primary text-sidebar-primary-foreground'
//                   : 'text-sidebar-foreground hover:bg-sidebar-accent'
//               )}
//             >
//               <Icon className="h-4 w-4 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Divider */}
//       <div className="border-t border-sidebar-border" />

//       {/* Bottom items */}
//       <nav className="space-y-1 px-3 py-4">
//         {bottomItems.map((item) => {
//           const Icon = item.icon
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
//                 isActive
//                   ? 'bg-sidebar-primary text-sidebar-primary-foreground'
//                   : 'text-sidebar-foreground hover:bg-sidebar-accent'
//               )}
//             >
//               <Icon className="h-4 w-4 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </Link>
//           )
//         })}

//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
//         >
//           <LogOut className="h-4 w-4 flex-shrink-0" />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </nav>

//       {/* User info at bottom */}
//       <div className="border-t border-sidebar-border px-3 py-3">
//         {collapsed ? (
//           <div
//             className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mx-auto cursor-default"
//             title={email}
//           >
//             {initials}
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               {initials}
//             </div>
//             <div className="min-w-0">
//               <p className="text-xs font-semibold text-sidebar-foreground truncate">
//                 {displayName}
//               </p>
//               <p className="text-[10px] text-sidebar-foreground/60 truncate">
//                 {email}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   )
// }



'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { EcoTrackLogo } from '@/components/ecotrack-logo'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { label: 'Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
  { label: 'Forecasting', href: '/dashboard/forecasting', icon: TrendingUp },
]

const bottomItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help & Support', href: '/dashboard/help', icon: HelpCircle },
]

function getInitials(email: string): string {
  const name = email.split('@')[0]
  const parts = name.split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function getDisplayName(user: any): string {
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name
  if (user?.user_metadata?.name) return user.user_metadata.name
  if (user?.email) {
    const name = user.email.split('@')[0]
    return name
      .split(/[._-]/)
      .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
  }
  return 'User'
}

export function DashboardSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogoutConfirm = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      router.push('/login')
    }
  }

  const displayName = user ? getDisplayName(user) : 'User'
  const initials = user?.email ? getInitials(user.email) : 'U'
  const email = user?.email || ''

  return (
    <>
      <aside
        className={cn(
          'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5">
          {!collapsed && (
            <EcoTrackLogo
              size="sm"
              className="[&_span]:text-sidebar-foreground"
            />
          )}
          <button
            onClick={onToggle}
            className="rounded-lg p-2 hover:bg-sidebar-accent text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-sidebar-border" />

        {/* Bottom items */}
        <nav className="space-y-1 px-3 py-4">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-sidebar-border px-3 py-3">
          {collapsed ? (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mx-auto cursor-default"
              title={email}
            >
              {initials}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate">
                  {email}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of EcoTrack?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page. Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}