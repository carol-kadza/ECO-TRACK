"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { day: "Mon", predicted: 85, actual: 78 },
  { day: "Tue", predicted: 72, actual: 75 },
  { day: "Wed", predicted: 90, actual: 88 },
  { day: "Thu", predicted: 68, actual: 72 },
  { day: "Fri", predicted: 110, actual: 105 },
  { day: "Sat", predicted: 125, actual: 0 },
  { day: "Sun", predicted: 95, actual: 0 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          {p.name === "predicted" ? "Predicted" : "Actual"}: <span className="font-semibold text-foreground">{p.value} units</span>
        </p>
      ))}
    </div>
  )
}

export function DemandChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(160, 15%, 14%)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
          />
          <Bar
            dataKey="predicted"
            fill="hsl(152, 55%, 45%)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="actual"
            fill="hsl(38, 92%, 50%)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
