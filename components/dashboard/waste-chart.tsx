// "use client"

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts"

// const data = [
//   { date: "Jan 16", waste: 42, target: 35 },
//   { date: "Jan 17", waste: 38, target: 35 },
//   { date: "Jan 18", waste: 45, target: 35 },
//   { date: "Jan 19", waste: 35, target: 35 },
//   { date: "Jan 20", waste: 28, target: 35 },
//   { date: "Jan 21", waste: 32, target: 35 },
//   { date: "Jan 22", waste: 30, target: 35 },
//   { date: "Jan 23", waste: 25, target: 35 },
//   { date: "Jan 24", waste: 22, target: 35 },
//   { date: "Jan 25", waste: 28, target: 35 },
//   { date: "Jan 26", waste: 18, target: 35 },
//   { date: "Jan 27", waste: 24, target: 35 },
//   { date: "Jan 28", waste: 20, target: 35 },
//   { date: "Jan 29", waste: 15, target: 35 },
//   { date: "Jan 30", waste: 19, target: 35 },
//   { date: "Jan 31", waste: 22, target: 35 },
//   { date: "Feb 1", waste: 16, target: 35 },
//   { date: "Feb 2", waste: 18, target: 35 },
//   { date: "Feb 3", waste: 14, target: 35 },
//   { date: "Feb 4", waste: 20, target: 35 },
//   { date: "Feb 5", waste: 12, target: 35 },
//   { date: "Feb 6", waste: 15, target: 35 },
//   { date: "Feb 7", waste: 11, target: 35 },
//   { date: "Feb 8", waste: 13, target: 35 },
//   { date: "Feb 9", waste: 10, target: 35 },
//   { date: "Feb 10", waste: 14, target: 35 },
//   { date: "Feb 11", waste: 9, target: 35 },
//   { date: "Feb 12", waste: 12, target: 35 },
//   { date: "Feb 13", waste: 8, target: 35 },
//   { date: "Feb 14", waste: 11, target: 35 },
// ]

// function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
//   if (!active || !payload) return null
//   return (
//     <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
//       <p className="text-xs font-medium text-foreground mb-1">{label}</p>
//       {payload.map((p) => (
//         <p key={p.name} className="text-xs text-muted-foreground">
//           {p.name === "waste" ? "Waste" : "Target"}: <span className="font-semibold text-foreground">{p.value} kg</span>
//         </p>
//       ))}
//     </div>
//   )
// }

// export function WasteChart() {
//   return (
//     <div className="h-[280px] w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
//           <defs>
//             <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0.2} />
//               <stop offset="95%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid
//             strokeDasharray="3 3"
//             stroke="hsl(160, 15%, 14%)"
//             vertical={false}
//           />
//           <XAxis
//             dataKey="date"
//             tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }}
//             axisLine={false}
//             tickLine={false}
//             interval={4}
//           />
//           <YAxis
//             tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }}
//             axisLine={false}
//             tickLine={false}
//             unit=" kg"
//           />
//           <Tooltip content={<CustomTooltip />} />
//           <Area
//             type="monotone"
//             dataKey="target"
//             stroke="hsl(0, 72%, 51%)"
//             strokeWidth={1}
//             strokeDasharray="4 4"
//             fill="none"
//             dot={false}
//           />
//           <Area
//             type="monotone"
//             dataKey="waste"
//             stroke="hsl(152, 55%, 45%)"
//             strokeWidth={2}
//             fill="url(#wasteGrad)"
//             dot={false}
//             activeDot={{ r: 4, stroke: "hsl(152, 55%, 45%)", strokeWidth: 2, fill: "hsl(160, 30%, 4%)" }}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }



"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { WasteChartPoint } from "@/lib/hooks/use-dashboard"

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          {p.name === "waste" ? "Waste" : "Target"}:{" "}
          <span className="font-semibold text-foreground">{p.value} units</span>
        </p>
      ))}
    </div>
  )
}

export function WasteChart({ data }: { data: WasteChartPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No waste data yet. Add inventory to get started.</p>
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(152, 55%, 45%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(152, 55%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 14%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} unit=" u" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="target" stroke="hsl(0, 72%, 51%)" strokeWidth={1} strokeDasharray="4 4" fill="none" dot={false} />
          <Area type="monotone" dataKey="waste"  stroke="hsl(152, 55%, 45%)" strokeWidth={2} fill="url(#wasteGrad)" dot={false}
            activeDot={{ r: 4, stroke: "hsl(152, 55%, 45%)", strokeWidth: 2, fill: "hsl(160, 30%, 4%)" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
