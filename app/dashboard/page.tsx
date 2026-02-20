


// "use client"

// import {
//   TrendingDown,
//   DollarSign,
//   Package,
//   AlertTriangle,
//   Leaf,
//   ArrowUpRight,
//   Clock,
// } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { StatCard } from "@/components/dashboard/stat-card"
// import { WasteChart } from "@/components/dashboard/waste-chart"
// import { DemandChart } from "@/components/dashboard/demand-chart"
// import { useAuth } from "@/lib/auth-context"

// function getFirstName(user: any): string {
//   if (user?.user_metadata?.full_name) {
//     return user.user_metadata.full_name.split(" ")[0]
//   }
//   if (user?.user_metadata?.name) {
//     return user.user_metadata.name.split(" ")[0]
//   }
//   if (user?.email) {
//     const name = user.email.split("@")[0]
//     const parts = name.split(/[._-]/)
//     return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
//   }
//   return "there"
// }

// const recentAlerts = [
//   {
//     id: 1,
//     type: "expiry",
//     product: "Sourdough Loaves",
//     message: "12 units expiring in 2 days",
//     time: "10 min ago",
//     severity: "high" as const,
//   },
//   {
//     id: 2,
//     type: "surplus",
//     product: "Croissants",
//     message: "Projected surplus of 25 units tomorrow",
//     time: "1 hr ago",
//     severity: "medium" as const,
//   },
//   {
//     id: 3,
//     type: "low-stock",
//     product: "Whole Wheat Flour",
//     message: "Stock below reorder threshold",
//     time: "2 hrs ago",
//     severity: "low" as const,
//   },
//   {
//     id: 4,
//     type: "expiry",
//     product: "Fresh Cream",
//     message: "8 liters expiring tomorrow",
//     time: "3 hrs ago",
//     severity: "high" as const,
//   },
// ]

// const topWasteItems = [
//   { name: "Croissants", waste: 18, total: 120, percentage: 15 },
//   { name: "Sourdough", waste: 12, total: 80, percentage: 15 },
//   { name: "Baguettes", waste: 8, total: 100, percentage: 8 },
//   { name: "Danish Pastry", waste: 6, total: 45, percentage: 13.3 },
//   { name: "Rye Bread", waste: 4, total: 60, percentage: 6.7 },
// ]

// const aiInsights = [
//   {
//     title: "Reduce croissant production by 15% on Mondays",
//     impact: "Could save ~N12,400/week",
//     confidence: 87,
//   },
//   {
//     title: "Sourdough demand peaks on Fridays",
//     impact: "Increase production by 20 units",
//     confidence: 92,
//   },
//   {
//     title: "Consider a 4PM discount window for pastries",
//     impact: "Recover ~N8,200 in potential waste",
//     confidence: 78,
//   },
// ]

// export default function DashboardPage() {
//   const { user } = useAuth()
//   const firstName = getFirstName(user)

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Page header */}
//       <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">
//             Dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             {"Welcome back, " + firstName + ". Here\u2019s your business overview."}
//           </p>
//         </div>
//         <div className="flex items-center gap-2 mt-2 sm:mt-0">
//           <Badge variant="outline" className="text-xs font-normal gap-1.5 py-1 px-2.5 text-muted-foreground">
//             <Clock className="h-3 w-3" />
//             Last updated: 2 min ago
//           </Badge>
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Waste Reduced"
//           value="35.2%"
//           change="+8.1%"
//           changeType="positive"
//           icon={TrendingDown}
//           subtitle="vs last month"
//         />
//         <StatCard
//           title="Money Saved"
//           value="N142,800"
//           change="+N23,400"
//           changeType="positive"
//           icon={DollarSign}
//           subtitle="this month"
//         />
//         <StatCard
//           title="Active Products"
//           value="48"
//           change="+3"
//           changeType="neutral"
//           icon={Package}
//           subtitle="tracked items"
//         />
//         <StatCard
//           title="Active Alerts"
//           value="7"
//           change="-2"
//           changeType="positive"
//           icon={AlertTriangle}
//           subtitle="from yesterday"
//         />
//       </div>

//       {/* Charts row */}
//       <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
//         <Card className="xl:col-span-4">
//           <CardHeader className="pb-2">
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-base font-semibold">
//                   Waste Trend
//                 </CardTitle>
//                 <CardDescription>
//                   Daily food waste over the past 30 days
//                 </CardDescription>
//               </div>
//               <Badge variant="secondary" className="text-xs font-normal">
//                 30 days
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-2">
//             <WasteChart />
//           </CardContent>
//         </Card>

//         <Card className="xl:col-span-3">
//           <CardHeader className="pb-2">
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-base font-semibold">
//                   Demand Forecast
//                 </CardTitle>
//                 <CardDescription>
//                   Predicted vs actual for this week
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-2">
//             <DemandChart />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Bottom row */}
//       <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
//         {/* AI Insights */}
//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center gap-2">
//               <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
//                 <Leaf className="h-3.5 w-3.5 text-primary" />
//               </div>
//               <CardTitle className="text-base font-semibold">
//                 AI Insights
//               </CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-3">
//             {aiInsights.map((insight) => (
//               <div
//                 key={insight.title}
//                 className="flex flex-col gap-1.5 rounded-lg border border-border p-3"
//               >
//                 <div className="flex items-start justify-between gap-2">
//                   <p className="text-sm font-medium text-foreground leading-snug">
//                     {insight.title}
//                   </p>
//                   <Badge
//                     variant="secondary"
//                     className="shrink-0 text-[10px] font-semibold"
//                   >
//                     {insight.confidence}%
//                   </Badge>
//                 </div>
//                 <p className="text-xs text-primary font-medium">
//                   {insight.impact}
//                 </p>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Recent Alerts */}
//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-base font-semibold">
//                 Recent Alerts
//               </CardTitle>
//               <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground">
//                 View all
//                 <ArrowUpRight className="h-3 w-3" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2.5">
//             {recentAlerts.map((alert) => (
//               <div
//                 key={alert.id}
//                 className="flex items-start gap-3 rounded-lg border border-border p-3"
//               >
//                 <div
//                   className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
//                     alert.severity === "high"
//                       ? "bg-destructive"
//                       : alert.severity === "medium"
//                         ? "bg-accent"
//                         : "bg-primary"
//                   }`}
//                 />
//                 <div className="flex flex-col gap-0.5 min-w-0">
//                   <p className="text-sm font-medium text-foreground truncate">
//                     {alert.product}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {alert.message}
//                   </p>
//                   <p className="text-[10px] text-muted-foreground/60 mt-0.5">
//                     {alert.time}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Top Waste Items */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base font-semibold">
//               Top Waste Items
//             </CardTitle>
//             <CardDescription>
//               Products with highest waste this week
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-3">
//             {topWasteItems.map((item, i) => (
//               <div key={item.name} className="flex items-center gap-3">
//                 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
//                   {i + 1}
//                 </span>
//                 <div className="flex flex-1 flex-col gap-1">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-foreground">
//                       {item.name}
//                     </span>
//                     <span className="text-xs text-destructive font-semibold">
//                       {item.waste} units
//                     </span>
//                   </div>
//                   <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
//                     <div
//                       className="h-full rounded-full bg-destructive/70 transition-all"
//                       style={{ width: `${item.percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




"use client"

import {
  TrendingDown, DollarSign, Package, AlertTriangle,
  Leaf, ArrowUpRight, Clock, RefreshCw,
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/stat-card"
import { WasteChart } from "@/components/dashboard/waste-chart"
import { DemandChart } from "@/components/dashboard/demand-chart"
import { useAuth } from "@/lib/auth-context"
import { useDashboard } from "@/lib/hooks/use-dashboard"
import Link from "next/link"

function getFirstName(user: any): string {
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0]
  if (user?.user_metadata?.name) return user.user_metadata.name.split(" ")[0]
  if (user?.email) {
    const name = user.email.split("@")[0]
    const parts = name.split(/[._-]/)
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  }
  return "there"
}

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `N${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `N${(val / 1_000).toFixed(0)}K`
  return `N${val.toFixed(0)}`
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatLastUpdated(date: Date | null) {
  if (!date) return "Never"
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return "Just now"
  return `${diff} min ago`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch, lastUpdated } = useDashboard()
  const firstName = getFirstName(user)

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="h-7 w-48 rounded bg-secondary animate-pulse" />
          <div className="h-4 w-72 rounded bg-secondary animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <Card key={i}><CardContent className="p-5"><div className="h-20 rounded bg-secondary animate-pulse" /></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
          <Card className="xl:col-span-4"><CardContent className="p-5"><div className="h-[280px] rounded bg-secondary animate-pulse" /></CardContent></Card>
          <Card className="xl:col-span-3"><CardContent className="p-5"><div className="h-[280px] rounded bg-secondary animate-pulse" /></CardContent></Card>
        </div>
      </div>
    )
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-base font-semibold text-foreground">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">{error}</p>
            <Button size="sm" className="mt-4" onClick={refetch}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = data?.stats
  const revenueChange = stats
    ? stats.totalRevenueLastMonth > 0
      ? ((stats.totalRevenue - stats.totalRevenueLastMonth) / stats.totalRevenueLastMonth * 100).toFixed(1)
      : null
    : null
  const wasteChange = stats
    ? stats.wasteUnitsLastMonth > 0
      ? ((stats.wasteUnitsLastMonth - stats.wasteUnits) / stats.wasteUnitsLastMonth * 100).toFixed(1)
      : null
    : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {"Welcome back, " + firstName + ". Here\u2019s your business overview."}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={refetch} title="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Badge variant="outline" className="text-xs font-normal gap-1.5 py-1 px-2.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last updated: {formatLastUpdated(lastUpdated)}
          </Badge>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Waste Reduced"
          value={wasteChange ? `${wasteChange}%` : "—"}
          change={wasteChange ? `${Number(wasteChange) >= 0 ? "+" : ""}${wasteChange}%` : "No prior data"}
          changeType={wasteChange && Number(wasteChange) > 0 ? "positive" : "neutral"}
          icon={TrendingDown}
          subtitle="vs last month"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          change={revenueChange ? `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%` : "No prior data"}
          changeType={revenueChange && Number(revenueChange) >= 0 ? "positive" : "negative"}
          icon={DollarSign}
          subtitle="this month"
        />
        <StatCard
          title="Active Products"
          value={String(stats?.activeProducts ?? 0)}
          change={stats?.activeProducts ? `${stats.activeProducts} tracked` : "None yet"}
          changeType="neutral"
          icon={Package}
          subtitle="tracked items"
        />
        <StatCard
          title="Active Alerts"
          value={String(stats?.activeAlerts ?? 0)}
          change={stats?.criticalAlerts ? `${stats.criticalAlerts} critical` : "None critical"}
          changeType={stats?.criticalAlerts ? "negative" : "positive"}
          icon={AlertTriangle}
          subtitle="need attention"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Waste Trend</CardTitle>
                <CardDescription>Expired inventory units over the past 30 days</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-normal">30 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <WasteChart data={data?.wasteChart ?? []} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Demand This Week</CardTitle>
              <CardDescription>Units sold per day vs forecast</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <DemandChart data={data?.demandChart ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* AI Insights — derived from real data */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Leaf className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(!data?.topWasteItems.length && !data?.stats.activeAlerts) ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Add products and sales data to generate AI insights.
              </p>
            ) : (
              <>
                {data?.topWasteItems[0] && (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        Reduce {data.topWasteItems[0].name} waste — highest loss item this month
                      </p>
                      <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold">
                        {data.topWasteItems[0].percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">
                      {data.topWasteItems[0].waste} units expired — review production volume
                    </p>
                  </div>
                )}
                {stats && stats.activeAlerts > 0 && (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {stats.criticalAlerts > 0
                          ? `${stats.criticalAlerts} critical alert${stats.criticalAlerts > 1 ? "s" : ""} need immediate action`
                          : `${stats.activeAlerts} active alert${stats.activeAlerts > 1 ? "s" : ""} need your attention`}
                      </p>
                      <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold">Now</Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">Review alerts to prevent losses</p>
                  </div>
                )}
                {stats && stats.totalRevenue > 0 && stats.totalRevenueLastMonth > 0 && (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        Revenue {Number(revenueChange) >= 0 ? "up" : "down"} {Math.abs(Number(revenueChange))}% vs last month
                      </p>
                      <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold">
                        {revenueChange}%
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">
                      {formatCurrency(stats.totalRevenue)} earned this month
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Alerts</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground" asChild>
                <Link href="/dashboard/alerts">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {!data?.recentAlerts.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No active alerts.</p>
            ) : data.recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  alert.severity === "critical" || alert.severity === "high"
                    ? "bg-destructive"
                    : alert.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-primary"
                }`} />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alert.product}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatTime(alert.created_at)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Waste Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Waste Items</CardTitle>
            <CardDescription>Products with most expired inventory this month</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {!data?.topWasteItems.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No expired inventory recorded yet.
              </p>
            ) : data.topWasteItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-destructive font-semibold">{item.waste} units</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-destructive/70 transition-all" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}