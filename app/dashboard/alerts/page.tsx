// "use client"

// import { useState } from "react"
// import {
//   AlertTriangle,
//   Clock,
//   Package,
//   TrendingUp,
//   Check,
//   X,
//   Filter,
//   Bell,
//   BellOff,
// } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// type Alert = {
//   id: number
//   type: "expiry" | "surplus" | "low-stock" | "recommendation"
//   severity: "critical" | "high" | "medium" | "low"
//   product: string
//   message: string
//   detail: string
//   time: string
//   dismissed: boolean
// }

// const alertsData: Alert[] = [
//   {
//     id: 1, type: "expiry", severity: "critical", product: "Fresh Cream",
//     message: "8 liters expiring tomorrow",
//     detail: "Consider discounting or using in today's production. Value at risk: K22,400",
//     time: "10 min ago", dismissed: false,
//   },
//   {
//     id: 2, type: "expiry", severity: "critical", product: "Sourdough Loaves",
//     message: "12 units expiring in 2 days",
//     detail: "Historical data suggests a 4PM discount could recover 80% of value.",
//     time: "25 min ago", dismissed: false,
//   },
//   {
//     id: 3, type: "surplus", severity: "high", product: "Croissants",
//     message: "Projected surplus of 25 units tomorrow",
//     detail: "Monday demand is typically 15% lower. Consider reducing production batch.",
//     time: "1 hr ago", dismissed: false,
//   },
//   {
//     id: 4, type: "expiry", severity: "high", product: "Danish Pastry",
//     message: "22 units expiring in 1 day",
//     detail: "Bundle offer could move 15+ units before end of day.",
//     time: "1 hr ago", dismissed: false,
//   },
//   {
//     id: 5, type: "low-stock", severity: "medium", product: "Whole Wheat Flour",
//     message: "Stock below reorder threshold",
//     detail: "Current stock: 8kg. Average weekly usage: 25kg. Reorder recommended.",
//     time: "2 hrs ago", dismissed: false,
//   },
//   {
//     id: 6, type: "low-stock", severity: "medium", product: "Sugar",
//     message: "Running low - 5kg remaining",
//     detail: "At current usage rate, stock will last approximately 3 days.",
//     time: "3 hrs ago", dismissed: false,
//   },
//   {
//     id: 7, type: "recommendation", severity: "low", product: "Baguettes",
//     message: "Increase Friday production by 20%",
//     detail: "AI detected consistent Friday demand spikes over the past 4 weeks.",
//     time: "5 hrs ago", dismissed: false,
//   },
//   {
//     id: 8, type: "expiry", severity: "critical", product: "Yeast",
//     message: "3 packs expired today",
//     detail: "Expired stock should be removed from inventory. Loss: K6,600",
//     time: "6 hrs ago", dismissed: false,
//   },
//   {
//     id: 9, type: "recommendation", severity: "low", product: "Cinnamon Rolls",
//     message: "New trending item detected",
//     detail: "Sales up 18% week-over-week. Consider increasing production capacity.",
//     time: "8 hrs ago", dismissed: false,
//   },
// ]

// const typeConfig = {
//   expiry: { label: "Expiry", icon: Clock, color: "text-destructive" },
//   surplus: { label: "Surplus", icon: TrendingUp, color: "text-accent" },
//   "low-stock": { label: "Low Stock", icon: Package, color: "text-accent" },
//   recommendation: { label: "AI Tip", icon: TrendingUp, color: "text-primary" },
// }

// const severityConfig = {
//   critical: { label: "Critical", style: "bg-destructive text-destructive-foreground" },
//   high: { label: "High", style: "bg-destructive/10 text-destructive border border-destructive/20" },
//   medium: { label: "Medium", style: "bg-accent/10 text-accent-foreground border border-accent/20" },
//   low: { label: "Low", style: "bg-primary/10 text-primary border border-primary/20" },
// }

// const filterOptions = ["All", "Expiry", "Surplus", "Low Stock", "AI Tips"]

// export default function AlertsPage() {
//   const [alerts, setAlerts] = useState(alertsData)
//   const [activeFilter, setActiveFilter] = useState("All")
//   const [showDismissed, setShowDismissed] = useState(false)

//   const dismiss = (id: number) => {
//     setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)))
//   }

//   const dismissAll = () => {
//     setAlerts((prev) => prev.map((a) => ({ ...a, dismissed: true })))
//   }

//   const filtered = alerts.filter((a) => {
//     if (!showDismissed && a.dismissed) return false
//     if (activeFilter === "All") return true
//     if (activeFilter === "Expiry") return a.type === "expiry"
//     if (activeFilter === "Surplus") return a.type === "surplus"
//     if (activeFilter === "Low Stock") return a.type === "low-stock"
//     if (activeFilter === "AI Tips") return a.type === "recommendation"
//     return true
//   })

//   const activeCount = alerts.filter((a) => !a.dismissed).length
//   const criticalCount = alerts.filter((a) => !a.dismissed && a.severity === "critical").length

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
//           <p className="text-sm text-muted-foreground">
//             {activeCount} active alerts{criticalCount > 0 && `, ${criticalCount} critical`}
//           </p>
//         </div>
//         <div className="flex items-center gap-2 mt-2 sm:mt-0">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowDismissed(!showDismissed)}
//             className="text-xs"
//           >
//             {showDismissed ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
//             {showDismissed ? "Hide dismissed" : "Show dismissed"}
//           </Button>
//           <Button variant="outline" size="sm" onClick={dismissAll} className="text-xs">
//             <Check className="h-3.5 w-3.5" />
//             Dismiss all
//           </Button>
//         </div>
//       </div>

//       {/* Summary row */}
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//         {[
//           { label: "Critical", count: alerts.filter((a) => !a.dismissed && a.severity === "critical").length, color: "bg-destructive/10 text-destructive" },
//           { label: "Expiring", count: alerts.filter((a) => !a.dismissed && a.type === "expiry").length, color: "bg-destructive/10 text-destructive" },
//           { label: "Low Stock", count: alerts.filter((a) => !a.dismissed && a.type === "low-stock").length, color: "bg-accent/10 text-accent-foreground" },
//           { label: "AI Tips", count: alerts.filter((a) => !a.dismissed && a.type === "recommendation").length, color: "bg-primary/10 text-primary" },
//         ].map((s) => (
//           <Card key={s.label}>
//             <CardContent className="flex items-center justify-between p-4">
//               <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
//               <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", s.color)}>
//                 {s.count}
//               </span>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Filter tabs */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-1">
//         {filterOptions.map((f) => (
//           <button
//             key={f}
//             onClick={() => setActiveFilter(f)}
//             className={cn(
//               "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
//               activeFilter === f
//                 ? "bg-primary text-primary-foreground"
//                 : "bg-secondary text-muted-foreground hover:text-foreground"
//             )}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {/* Alert cards */}
//       <div className="flex flex-col gap-3">
//         {filtered.map((alert) => {
//           const typeInfo = typeConfig[alert.type]
//           const sevInfo = severityConfig[alert.severity]
//           const Icon = typeInfo.icon
//           return (
//             <Card
//               key={alert.id}
//               className={cn(
//                 "transition-all",
//                 alert.dismissed && "opacity-50"
//               )}
//             >
//               <CardContent className="flex items-start gap-4 p-4">
//                 <div className={cn(
//                   "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//                   alert.severity === "critical" ? "bg-destructive/10" :
//                   alert.type === "recommendation" ? "bg-primary/10" : "bg-accent/10"
//                 )}>
//                   <Icon className={cn("h-4 w-4", typeInfo.color)} />
//                 </div>
//                 <div className="flex flex-1 flex-col gap-1.5 min-w-0">
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="text-sm font-semibold text-foreground">{alert.product}</p>
//                       <Badge className={cn("text-[10px] h-5 px-1.5 rounded-full", sevInfo.style)}>
//                         {sevInfo.label}
//                       </Badge>
//                       <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
//                         {typeInfo.label}
//                       </Badge>
//                     </div>
//                     {!alert.dismissed && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
//                         onClick={() => dismiss(alert.id)}
//                         aria-label="Dismiss alert"
//                       >
//                         <X className="h-3.5 w-3.5" />
//                       </Button>
//                     )}
//                   </div>
//                   <p className="text-sm text-foreground">{alert.message}</p>
//                   <p className="text-xs text-muted-foreground leading-relaxed">{alert.detail}</p>
//                   <p className="text-[10px] text-muted-foreground/60 mt-0.5">{alert.time}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}

//         {filtered.length === 0 && (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
//                 <Check className="h-7 w-7 text-primary" />
//               </div>
//               <p className="text-base font-semibold text-foreground">All clear</p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 No active alerts. Your inventory is looking healthy.
//               </p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useMemo } from "react"
import {
  Clock,
  Package,
  TrendingUp,
  Check,
  X,
  Search,
  AlarmClock,
  CheckCircle2,
  ChevronDown,
  History,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAlerts } from "@/lib/hooks/use-alerts"
import type { Alert, AlertType, Severity } from "@/lib/hooks/use-alerts"

const typeConfig: Record<AlertType, { label: string; icon: any; color: string; bg: string }> = {
  expiry:         { label: "Expiry",    icon: Clock,       color: "text-destructive",  bg: "bg-destructive/10" },
  surplus:        { label: "Surplus",   icon: TrendingUp,  color: "text-amber-500",    bg: "bg-amber-500/10"   },
  "low-stock":    { label: "Low Stock", icon: Package,     color: "text-amber-500",    bg: "bg-amber-500/10"   },
  recommendation: { label: "AI Tip",   icon: TrendingUp,  color: "text-primary",      bg: "bg-primary/10"     },
}

const severityConfig: Record<Severity, { label: string; style: string; dot: string }> = {
  critical: { label: "Critical", style: "bg-destructive text-destructive-foreground",                          dot: "bg-destructive"   },
  high:     { label: "High",     style: "bg-destructive/10 text-destructive border border-destructive/20",     dot: "bg-destructive/70"},
  medium:   { label: "Medium",   style: "bg-amber-500/10 text-amber-600 border border-amber-500/20",           dot: "bg-amber-500"     },
  low:      { label: "Low",      style: "bg-primary/10 text-primary border border-primary/20",                 dot: "bg-primary"       },
}

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const filterOptions = ["All", "Expiry", "Surplus", "Low Stock", "AI Tips"] as const
type FilterOption = typeof filterOptions[number]

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? "s" : ""} ago`
}

function formatSnoozedUntil(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function AlertsPage() {
  const { alerts, history, loading, error, refetch, resolveAlert, snoozeAlert, dismissAlert, dismissAll, reactivateAlert } = useAlerts()

  const [activeFilter, setActiveFilter] = useState<FilterOption>("All")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"time" | "severity">("severity")
  const [tab, setTab] = useState<"active" | "snoozed" | "resolved" | "history">("active")
  const [resolveDialog, setResolveDialog] = useState<Alert | null>(null)
  const [resolveNote, setResolveNote] = useState("")
  const [resolving, setResolving] = useState(false)

  const handleResolve = async () => {
    if (!resolveDialog) return
    setResolving(true)
    await resolveAlert(resolveDialog, resolveNote)
    setResolving(false)
    setResolveDialog(null)
    setResolveNote("")
  }

  const displayed = useMemo(() => {
    let list = alerts.filter((a) => {
      if (tab === "active") return a.status === "active"
      if (tab === "snoozed") return a.status === "snoozed"
      if (tab === "resolved") return a.status === "resolved"
      return true
    })

    const typeMap: Record<FilterOption, AlertType | null> = {
      All: null, Expiry: "expiry", Surplus: "surplus", "Low Stock": "low-stock", "AI Tips": "recommendation",
    }
    if (activeFilter !== "All" && typeMap[activeFilter] as AlertType) {
      list = list.filter((a) => a.alert_type === typeMap[activeFilter] as AlertType)
    }

    if (severityFilter !== "All") {
      list = list.filter((a) => a.severity === severityFilter.toLowerCase())
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.product.toLowerCase().includes(q) || a.message.toLowerCase().includes(q))
    }

    if (sortBy === "severity") {
      list = [...list].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    }

    return list
  }, [alerts, tab, activeFilter, severityFilter, search, sortBy])

  const activeCount   = alerts.filter((a) => a.status === "active").length
  const snoozedCount  = alerts.filter((a) => a.status === "snoozed").length
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length
  const criticalCount = alerts.filter((a) => a.status === "active" && a.severity === "critical").length

  const tabs = [
    { key: "active"  as const, label: "Active",   count: activeCount   },
    { key: "snoozed" as const, label: "Snoozed",  count: snoozedCount  },
    { key: "resolved"as const, label: "Resolved", count: resolvedCount },
    { key: "history" as const, label: "History",  count: history.length},
  ]

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">Loading your alerts...</p>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="h-9 w-9 rounded-lg bg-secondary animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 w-32 rounded bg-secondary animate-pulse" />
                  <div className="h-3 w-full rounded bg-secondary animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-secondary animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-base font-semibold text-foreground">Failed to load alerts</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">{error}</p>
            <Button size="sm" className="mt-4" onClick={refetch}>
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} active alert{activeCount !== 1 ? "s" : ""}
            {criticalCount > 0 && `, ${criticalCount} critical`}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={refetch} title="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          {tab === "active" && activeCount > 0 && (
            <Button variant="outline" size="sm" onClick={dismissAll} className="text-xs">
              <Check className="h-3.5 w-3.5" /> Dismiss all
            </Button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Critical",  count: alerts.filter((a) => a.status === "active" && a.severity === "critical").length,       color: "bg-destructive/10 text-destructive"  },
          { label: "Expiring",  count: alerts.filter((a) => a.status === "active" && a.alert_type === "expiry").length,             color: "bg-destructive/10 text-destructive"  },
          { label: "Low Stock", count: alerts.filter((a) => a.status === "active" && a.alert_type === "low-stock").length,          color: "bg-amber-500/10 text-amber-600"      },
          { label: "AI Tips",   count: alerts.filter((a) => a.status === "active" && a.alert_type === "recommendation").length,     color: "bg-primary/10 text-primary"          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", s.color)}>
                {s.count}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.key === "history" && <History className="h-3.5 w-3.5" />}
            {t.label}
            {t.count > 0 && (
              <span className={cn(
                "flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px] font-bold",
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      {tab !== "history" && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search alerts..." className="pl-8 h-9 bg-secondary border-transparent text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {filterOptions.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={cn("rounded-full px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
                  activeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                )}>{f}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  {severityFilter === "All" ? "Severity" : severityFilter}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["All", "Critical", "High", "Medium", "Low"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setSeverityFilter(s)}>
                    {s !== "All" && <span className={cn("mr-2 h-2 w-2 rounded-full inline-block", severityConfig[s.toLowerCase() as Severity]?.dot)} />}
                    {s}
                    {severityFilter === s && <Check className="ml-auto h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("severity")}>Severity {sortBy === "severity" && <Check className="ml-auto h-3.5 w-3.5" />}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("time")}>Time {sortBy === "time" && <Check className="ml-auto h-3.5 w-3.5" />}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary mb-4">
                  <History className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold text-foreground">No history yet</p>
                <p className="text-sm text-muted-foreground mt-1">Resolved or snoozed alerts will appear here.</p>
              </CardContent>
            </Card>
          ) : history.map((h) => (
            <div key={h.id} className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
              <div className={cn(
                "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                h.action === "resolved" ? "bg-primary/10 text-primary" :
                h.action === "snoozed"  ? "bg-amber-500/10 text-amber-500" : "bg-secondary text-muted-foreground"
              )}>
                {h.action === "resolved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : h.action === "snoozed" ? <AlarmClock className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{h.product}</p>
                  <span className="text-[10px] text-muted-foreground">{formatTime(h.created_at)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{h.message}</p>
                {h.note && <p className="text-xs text-foreground/70 mt-1 italic">"{h.note}"</p>}
                <Badge variant="secondary" className="mt-1.5 text-[10px] capitalize">{h.action}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Cards */}
      {tab !== "history" && (
        <div className="flex flex-col gap-3">
          {displayed.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">
                  {tab === "active" ? "No active alerts" : `No ${tab} alerts`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tab === "active"
                    ? alerts.length === 0
                      ? "Your alerts will appear here once generated."
                      : "No alerts match your current filters."
                    : `${tab === "snoozed" ? "Snoozed" : "Resolved"} alerts will appear here.`}
                </p>
              </CardContent>
            </Card>
          ) : displayed.map((alert) => {
            const typeInfo = typeConfig[alert.alert_type]
            const sevInfo  = severityConfig[alert.severity]
            const Icon     = typeInfo.icon

            return (
              <Card key={alert.id} className={cn("transition-all", alert.status === "resolved" && "opacity-60")}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", typeInfo.bg)}>
                    <Icon className={cn("h-4 w-4", typeInfo.color)} />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{alert.product?.name || `Product #${alert.product_id}`}</p>
                        <Badge className={cn("text-[10px] h-5 px-1.5 rounded-full", sevInfo.style)}>{sevInfo.label}</Badge>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{typeInfo.label}</Badge>
                      </div>

                      {alert.status === "active" && (
                        <div className="flex items-center gap-1 shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-amber-500" title="Snooze">
                                <AlarmClock className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Snooze for...</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => snoozeAlert(alert, 1)}>1 hour</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => snoozeAlert(alert, 4)}>4 hours</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => snoozeAlert(alert, 24)}>24 hours</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" title="Resolve" onClick={() => { setResolveDialog(alert); setResolveNote("") }}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Dismiss" onClick={() => dismissAlert(alert)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}

                      {(alert.status === "snoozed" || alert.status === "resolved") && (
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground shrink-0" onClick={() => reactivateAlert(alert.id as number)}>
                          Reactivate
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.detail}</p>

                    {alert.status === "snoozed" && alert.snoozed_until && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <AlarmClock className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-amber-500 font-medium">Snoozed until {formatSnoozedUntil(alert.snoozed_until)}</span>
                      </div>
                    )}
                    {alert.status === "resolved" && alert.resolved_note && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">Note: "{alert.resolved_note}"</p>
                    )}

                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatTime(alert.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog open={!!resolveDialog} onOpenChange={(open) => { if (!open) setResolveDialog(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Mark <span className="font-semibold text-foreground">{resolveDialog?.product}</span> as resolved. Optionally add a note about the action taken.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label htmlFor="resolve-note">Resolution note (optional)</Label>
            <Textarea id="resolve-note" placeholder="e.g. Applied 4PM discount, sold 10 units..." rows={3} value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)}>Cancel</Button>
            <Button onClick={handleResolve} disabled={resolving}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {resolving ? "Saving..." : "Mark as resolved"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}