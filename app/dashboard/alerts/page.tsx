"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Clock,
  Package,
  TrendingUp,
  Check,
  X,
  Filter,
  Bell,
  BellOff,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Alert = {
  id: number
  type: "expiry" | "surplus" | "low-stock" | "recommendation"
  severity: "critical" | "high" | "medium" | "low"
  product: string
  message: string
  detail: string
  time: string
  dismissed: boolean
}

const alertsData: Alert[] = [
  {
    id: 1, type: "expiry", severity: "critical", product: "Fresh Cream",
    message: "8 liters expiring tomorrow",
    detail: "Consider discounting or using in today's production. Value at risk: K22,400",
    time: "10 min ago", dismissed: false,
  },
  {
    id: 2, type: "expiry", severity: "critical", product: "Sourdough Loaves",
    message: "12 units expiring in 2 days",
    detail: "Historical data suggests a 4PM discount could recover 80% of value.",
    time: "25 min ago", dismissed: false,
  },
  {
    id: 3, type: "surplus", severity: "high", product: "Croissants",
    message: "Projected surplus of 25 units tomorrow",
    detail: "Monday demand is typically 15% lower. Consider reducing production batch.",
    time: "1 hr ago", dismissed: false,
  },
  {
    id: 4, type: "expiry", severity: "high", product: "Danish Pastry",
    message: "22 units expiring in 1 day",
    detail: "Bundle offer could move 15+ units before end of day.",
    time: "1 hr ago", dismissed: false,
  },
  {
    id: 5, type: "low-stock", severity: "medium", product: "Whole Wheat Flour",
    message: "Stock below reorder threshold",
    detail: "Current stock: 8kg. Average weekly usage: 25kg. Reorder recommended.",
    time: "2 hrs ago", dismissed: false,
  },
  {
    id: 6, type: "low-stock", severity: "medium", product: "Sugar",
    message: "Running low - 5kg remaining",
    detail: "At current usage rate, stock will last approximately 3 days.",
    time: "3 hrs ago", dismissed: false,
  },
  {
    id: 7, type: "recommendation", severity: "low", product: "Baguettes",
    message: "Increase Friday production by 20%",
    detail: "AI detected consistent Friday demand spikes over the past 4 weeks.",
    time: "5 hrs ago", dismissed: false,
  },
  {
    id: 8, type: "expiry", severity: "critical", product: "Yeast",
    message: "3 packs expired today",
    detail: "Expired stock should be removed from inventory. Loss: K6,600",
    time: "6 hrs ago", dismissed: false,
  },
  {
    id: 9, type: "recommendation", severity: "low", product: "Cinnamon Rolls",
    message: "New trending item detected",
    detail: "Sales up 18% week-over-week. Consider increasing production capacity.",
    time: "8 hrs ago", dismissed: false,
  },
]

const typeConfig = {
  expiry: { label: "Expiry", icon: Clock, color: "text-destructive" },
  surplus: { label: "Surplus", icon: TrendingUp, color: "text-accent" },
  "low-stock": { label: "Low Stock", icon: Package, color: "text-accent" },
  recommendation: { label: "AI Tip", icon: TrendingUp, color: "text-primary" },
}

const severityConfig = {
  critical: { label: "Critical", style: "bg-destructive text-destructive-foreground" },
  high: { label: "High", style: "bg-destructive/10 text-destructive border border-destructive/20" },
  medium: { label: "Medium", style: "bg-accent/10 text-accent-foreground border border-accent/20" },
  low: { label: "Low", style: "bg-primary/10 text-primary border border-primary/20" },
}

const filterOptions = ["All", "Expiry", "Surplus", "Low Stock", "AI Tips"]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(alertsData)
  const [activeFilter, setActiveFilter] = useState("All")
  const [showDismissed, setShowDismissed] = useState(false)

  const dismiss = (id: number) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)))
  }

  const dismissAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, dismissed: true })))
  }

  const filtered = alerts.filter((a) => {
    if (!showDismissed && a.dismissed) return false
    if (activeFilter === "All") return true
    if (activeFilter === "Expiry") return a.type === "expiry"
    if (activeFilter === "Surplus") return a.type === "surplus"
    if (activeFilter === "Low Stock") return a.type === "low-stock"
    if (activeFilter === "AI Tips") return a.type === "recommendation"
    return true
  })

  const activeCount = alerts.filter((a) => !a.dismissed).length
  const criticalCount = alerts.filter((a) => !a.dismissed && a.severity === "critical").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} active alerts{criticalCount > 0 && `, ${criticalCount} critical`}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDismissed(!showDismissed)}
            className="text-xs"
          >
            {showDismissed ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            {showDismissed ? "Hide dismissed" : "Show dismissed"}
          </Button>
          <Button variant="outline" size="sm" onClick={dismissAll} className="text-xs">
            <Check className="h-3.5 w-3.5" />
            Dismiss all
          </Button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Critical", count: alerts.filter((a) => !a.dismissed && a.severity === "critical").length, color: "bg-destructive/10 text-destructive" },
          { label: "Expiring", count: alerts.filter((a) => !a.dismissed && a.type === "expiry").length, color: "bg-destructive/10 text-destructive" },
          { label: "Low Stock", count: alerts.filter((a) => !a.dismissed && a.type === "low-stock").length, color: "bg-accent/10 text-accent-foreground" },
          { label: "AI Tips", count: alerts.filter((a) => !a.dismissed && a.type === "recommendation").length, color: "bg-primary/10 text-primary" },
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

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((alert) => {
          const typeInfo = typeConfig[alert.type]
          const sevInfo = severityConfig[alert.severity]
          const Icon = typeInfo.icon
          return (
            <Card
              key={alert.id}
              className={cn(
                "transition-all",
                alert.dismissed && "opacity-50"
              )}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  alert.severity === "critical" ? "bg-destructive/10" :
                  alert.type === "recommendation" ? "bg-primary/10" : "bg-accent/10"
                )}>
                  <Icon className={cn("h-4 w-4", typeInfo.color)} />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{alert.product}</p>
                      <Badge className={cn("text-[10px] h-5 px-1.5 rounded-full", sevInfo.style)}>
                        {sevInfo.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {typeInfo.label}
                      </Badge>
                    </div>
                    {!alert.dismissed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => dismiss(alert.id)}
                        aria-label="Dismiss alert"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.detail}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{alert.time}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <Check className="h-7 w-7 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground">All clear</p>
              <p className="text-sm text-muted-foreground mt-1">
                No active alerts. Your inventory is looking healthy.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
