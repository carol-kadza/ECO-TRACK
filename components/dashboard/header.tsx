// "use client"

// import { Bell, Search, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

// export function DashboardHeader({
//   onMenuClick,
// }: {
//   onMenuClick: () => void
// }) {
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
//             CK
//           </div>
//           <div className="hidden sm:flex flex-col">
//             <span className="text-xs font-semibold text-foreground leading-none">
//               Carol Kadza
//             </span>
//             <span className="text-[10px] text-muted-foreground leading-none mt-1">
//               Fresh Bakes 
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

function getInitials(email: string): string {
  const name = email.split("@")[0]
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
    const name = user.email.split("@")[0]
    return name
      .split(/[._-]/)
      .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  }
  return "User"
}

function getBusinessName(user: any): string {
  if (user?.user_metadata?.business_name) return user.user_metadata.business_name
  if (user?.user_metadata?.company) return user.user_metadata.company
  return user?.email?.split("@")[1]?.split(".")[0] || "EcoTrack"
}

export function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const { user } = useAuth()

  const displayName = user ? getDisplayName(user) : "User"
  const initials = user?.email ? getInitials(user.email) : "U"
  const businessName = user ? getBusinessName(user) : "EcoTrack"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory, alerts..."
            className="w-72 pl-9 h-9 bg-secondary border-transparent focus-visible:border-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-foreground leading-none">
              {displayName}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">
              {businessName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}