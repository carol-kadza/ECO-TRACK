// // "use client"

// // import { Bell, Search, Menu } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Badge } from "@/components/ui/badge"

// // export function DashboardHeader({
// //   onMenuClick,
// // }: {
// //   onMenuClick: () => void
// // }) {
// //   return (
// //     <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
// //       <div className="flex items-center gap-3">
// //         <Button
// //           variant="ghost"
// //           size="icon"
// //           className="lg:hidden text-foreground"
// //           onClick={onMenuClick}
// //           aria-label="Toggle menu"
// //         >
// //           <Menu className="h-5 w-5" />
// //         </Button>
// //         <div className="relative hidden md:block">
// //           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             placeholder="Search inventory, alerts..."
// //             className="w-72 pl-9 h-9 bg-secondary border-transparent focus-visible:border-input"
// //           />
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-3">
// //         <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
// //           <Bell className="h-[18px] w-[18px]" />
// //           <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
// //             3
// //           </Badge>
// //           <span className="sr-only">Notifications</span>
// //         </Button>

// //         <div className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-1.5">
// //           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
// //             CK
// //           </div>
// //           <div className="hidden sm:flex flex-col">
// //             <span className="text-xs font-semibold text-foreground leading-none">
// //               Carol Kadza
// //             </span>
// //             <span className="text-[10px] text-muted-foreground leading-none mt-1">
// //               Fresh Bakes 
// //             </span>
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   )
// // }


// "use client"

// import { Bell, Search, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { useAuth } from "@/lib/auth-context"

// function getInitials(email: string): string {
//   const name = email.split("@")[0]
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
//     const name = user.email.split("@")[0]
//     return name
//       .split(/[._-]/)
//       .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
//       .join(" ")
//   }
//   return "User"
// }

// function getBusinessName(user: any): string {
//   if (user?.user_metadata?.business_name) return user.user_metadata.business_name
//   if (user?.user_metadata?.company) return user.user_metadata.company
//   return user?.email?.split("@")[1]?.split(".")[0] || "EcoTrack"
// }

// export function DashboardHeader({
//   onMenuClick,
// }: {
//   onMenuClick: () => void
// }) {
//   const { user } = useAuth()

//   const displayName = user ? getDisplayName(user) : "User"
//   const initials = user?.email ? getInitials(user.email) : "U"
//   const businessName = user ? getBusinessName(user) : "EcoTrack"

//   return (
//     <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
//       <div className="flex items-center gap-3">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="lg:hidden text-foreground"
//           onClick={onMenuClick}
//           aria-label="Toggle menu"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//         <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search inventory, alerts..."
//             className="w-72 pl-9 h-9 bg-secondary border-transparent focus-visible:border-input"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
//           <Bell className="h-[18px] w-[18px]" />
//           <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
//             3
//           </Badge>
//           <span className="sr-only">Notifications</span>
//         </Button>

//         <div className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-1.5">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//             {initials}
//           </div>
//           <div className="hidden sm:flex flex-col">
//             <span className="text-xs font-semibold text-foreground leading-none">
//               {displayName}
//             </span>
//             <span className="text-[10px] text-muted-foreground leading-none mt-1">
//               {businessName}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Menu, Sun, Moon, Check, AlertTriangle, Clock, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Notif = {
  id: number
  message: string
  severity: string
  alert_type: string
  created_at: string
  is_dismissed: boolean
}

const severityIcon = (s: string) => {
  if (s === 'critical') return <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
  if (s === 'high')     return <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
  return <Package className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen]   = useState(false)
  const [notifs, setNotifs]         = useState<Notif[]>([])
  const [loadingNotifs, setLoading] = useState(false)

  const unread = notifs.filter((n) => !n.is_dismissed).length

  // Fetch active (non-dismissed) alerts as notifications
  useEffect(() => {
    if (!user) return
    const fetchNotifs = async () => {
      setLoading(true)
      try {
        const { data: biz } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        if (!biz) return

        const { data } = await supabase
          .from('alerts')
          .select('id, message, severity, alert_type, created_at, is_dismissed')
          .eq('business_id', biz.id)
          .eq('is_dismissed', false)
          .order('created_at', { ascending: false })
          .limit(10)

        setNotifs(data || [])
      } catch (_) {}
      finally { setLoading(false) }
    }
    fetchNotifs()
  }, [user])

  const dismissOne = async (id: number) => {
    await supabase.from('alerts').update({ is_dismissed: true }).eq('id', id)
    setNotifs((prev) => prev.filter((n) => n.id !== id))
  }

  const dismissAll = async () => {
    const ids = notifs.map((n) => n.id)
    if (!ids.length) return
    await supabase.from('alerts').update({ is_dismissed: true }).in('id', ids)
    setNotifs([])
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6 relative z-30">
      {/* Left — hamburger + search */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inventory, alerts..."
            className="w-72 pl-9 h-9 bg-secondary border-transparent focus-visible:border-input" />
        </div>
      </div>

      {/* Right — theme toggle + notifications */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <Button variant="ghost" size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark'
            ? <Sun className="h-[18px] w-[18px]" />
            : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => setNotifOpen((o) => !o)}>
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
                {unread > 9 ? '9+' : unread}
              </Badge>
            )}
          </Button>

          {/* Dropdown */}
          {notifOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />

              <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    {unread > 0 && (
                      <Badge className="text-[10px] h-5 px-1.5">{unread}</Badge>
                    )}
                  </div>
                  {unread > 0 && (
                    <button onClick={dismissAll}
                      className="text-xs text-primary hover:underline font-medium">
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="flex flex-col gap-2 p-3">
                      {[1,2,3].map((i) => (
                        <div key={i} className="h-12 rounded-lg bg-secondary animate-pulse" />
                      ))}
                    </div>
                  ) : notifs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary mb-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">You're all caught up</p>
                      <p className="text-xs text-muted-foreground mt-0.5">No unread notifications</p>
                    </div>
                  ) : (
                    notifs.map((n) => (
                      <div key={n.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 group">
                        {severityIcon(n.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                            {n.alert_type?.replace(/_/g, ' ')} · {timeAgo(n.created_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissOne(n.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground ml-1 shrink-0"
                          title="Dismiss">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2.5">
                  <Link href="/dashboard/alerts" onClick={() => setNotifOpen(false)}
                    className="text-xs text-primary hover:underline font-medium">
                    View all alerts →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}