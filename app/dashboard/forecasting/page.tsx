"use client"

import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Brain,
  Target,
  Zap,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const weeklyForecast = [
  { day: "Mon", predicted: 85, lower: 72, upper: 98 },
  { day: "Tue", predicted: 72, lower: 60, upper: 84 },
  { day: "Wed", predicted: 90, lower: 78, upper: 102 },
  { day: "Thu", predicted: 68, lower: 55, upper: 81 },
  { day: "Fri", predicted: 115, lower: 100, upper: 130 },
  { day: "Sat", predicted: 130, lower: 115, upper: 145 },
  { day: "Sun", predicted: 95, lower: 80, upper: 110 },
]

const productForecasts = [
  { product: "Sourdough Loaves", predicted: 45, trend: "up", confidence: 92, change: "+12%" },
  { product: "Croissants", predicted: 60, trend: "down", confidence: 88, change: "-8%" },
  { product: "Baguettes", predicted: 35, trend: "up", confidence: 85, change: "+5%" },
  { product: "Danish Pastry", predicted: 25, trend: "stable", confidence: 79, change: "0%" },
  { product: "Rye Bread", predicted: 30, trend: "up", confidence: 91, change: "+3%" },
  { product: "Cinnamon Rolls", predicted: 40, trend: "up", confidence: 86, change: "+18%" },
]

const categoryBreakdown = [
  { category: "Bread", demand: 110 },
  { category: "Pastries", demand: 85 },
  { category: "Cakes", demand: 45 },
  { category: "Beverages", demand: 65 },
  { category: "Prepared", demand: 30 },
]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value} units</span>
        </p>
      ))}
    </div>
  )
}

export default function ForecastingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Demand Forecasting
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered predictions to optimize your production planning
          </p>
        </div>
        <Button size="sm" className="mt-2 sm:mt-0">
          <Zap className="h-4 w-4" />
          Refresh Forecast
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Model Accuracy</p>
              <p className="text-xl font-bold text-foreground">89.3%</p>
              <p className="text-xs text-primary font-medium">+2.1% this week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Predicted</p>
              <p className="text-xl font-bold text-foreground">655 units</p>
              <p className="text-xs text-muted-foreground">for next 7 days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Waste Potential Saved</p>
              <p className="text-xl font-bold text-foreground">N48,200</p>
              <p className="text-xs text-primary font-medium">following recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Forecast Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Demand Forecast</CardTitle>
              <CardDescription>Predicted demand with confidence intervals</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">Next 7 days</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyForecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 14%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceGrad)" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(160, 30%, 4%)" />
                <Area type="monotone" dataKey="predicted" stroke="hsl(152, 55%, 45%)" strokeWidth={2} fill="url(#forecastGrad)" dot={{ r: 4, fill: "hsl(152, 55%, 45%)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Product Forecasts Table */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Product Forecasts</CardTitle>
            <CardDescription>Individual product demand predictions for tomorrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="grid grid-cols-5 gap-4 border-b border-border pb-2 mb-2">
                <span className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Predicted</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Trend</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Confidence</span>
              </div>
              {productForecasts.map((item) => (
                <div key={item.product} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-border/50 last:border-0">
                  <span className="col-span-2 text-sm font-medium text-foreground">{item.product}</span>
                  <span className="text-sm font-semibold text-foreground text-center">{item.predicted}</span>
                  <div className="flex items-center justify-center gap-1">
                    {item.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    ) : item.trend === "down" ? (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground rotate-45" />
                    )}
                    <span className={`text-xs font-medium ${item.trend === "up" ? "text-primary" : item.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                      {item.change}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <Badge variant={item.confidence >= 85 ? "default" : "secondary"} className="text-[10px] h-5 px-1.5">
                      {item.confidence}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">By Category</CardTitle>
            <CardDescription>Forecasted demand distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 14%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="demand" fill="hsl(152, 55%, 45%)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
