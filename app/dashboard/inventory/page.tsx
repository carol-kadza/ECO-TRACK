"use client"

import { useState } from "react"
import {
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  Check,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type InventoryItem = {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  costPerUnit: number
  expiresIn: number | null
  status: "good" | "low" | "expiring" | "expired"
  lastUpdated: string
}

const inventoryData: InventoryItem[] = [
  { id: 1, name: "Sourdough Loaves", category: "Bread", quantity: 45, unit: "units", costPerUnit: 850, expiresIn: 2, status: "expiring", lastUpdated: "2 hrs ago" },
  { id: 2, name: "Croissants", category: "Pastries", quantity: 78, unit: "units", costPerUnit: 450, expiresIn: 1, status: "expiring", lastUpdated: "1 hr ago" },
  { id: 3, name: "Whole Wheat Flour", category: "Ingredients", quantity: 8, unit: "kg", costPerUnit: 1200, expiresIn: 30, status: "low", lastUpdated: "3 hrs ago" },
  { id: 4, name: "Baguettes", category: "Bread", quantity: 62, unit: "units", costPerUnit: 650, expiresIn: 1, status: "expiring", lastUpdated: "2 hrs ago" },
  { id: 5, name: "Fresh Cream", category: "Dairy", quantity: 12, unit: "liters", costPerUnit: 2800, expiresIn: 3, status: "good", lastUpdated: "4 hrs ago" },
  { id: 6, name: "Butter", category: "Dairy", quantity: 25, unit: "kg", costPerUnit: 3500, expiresIn: 14, status: "good", lastUpdated: "1 day ago" },
  { id: 7, name: "Cinnamon Rolls", category: "Pastries", quantity: 30, unit: "units", costPerUnit: 550, expiresIn: 2, status: "good", lastUpdated: "3 hrs ago" },
  { id: 8, name: "Rye Bread", category: "Bread", quantity: 38, unit: "units", costPerUnit: 750, expiresIn: 3, status: "good", lastUpdated: "2 hrs ago" },
  { id: 9, name: "Sugar", category: "Ingredients", quantity: 5, unit: "kg", costPerUnit: 800, expiresIn: 90, status: "low", lastUpdated: "2 days ago" },
  { id: 10, name: "Danish Pastry", category: "Pastries", quantity: 22, unit: "units", costPerUnit: 600, expiresIn: 1, status: "expiring", lastUpdated: "1 hr ago" },
  { id: 11, name: "Eggs", category: "Dairy", quantity: 120, unit: "units", costPerUnit: 150, expiresIn: 7, status: "good", lastUpdated: "5 hrs ago" },
  { id: 12, name: "Yeast", category: "Ingredients", quantity: 3, unit: "packs", costPerUnit: 2200, expiresIn: 0, status: "expired", lastUpdated: "1 day ago" },
]

const filters = ["All", "Bread", "Pastries", "Dairy", "Ingredients"]

const statusConfig = {
  good: { label: "In Stock", color: "bg-primary/10 text-primary border-primary/20" },
  low: { label: "Low Stock", color: "bg-accent/10 text-accent border-accent/20" },
  expiring: { label: "Expiring Soon", color: "bg-destructive/10 text-destructive border-destructive/20" },
  expired: { label: "Expired", color: "bg-destructive text-destructive-foreground border-destructive" },
}

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "expires">("name")

  const filtered = inventoryData
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = activeFilter === "All" || item.category === activeFilter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "quantity") return a.quantity - b.quantity
      return (a.expiresIn ?? 999) - (b.expiresIn ?? 999)
    })

  const stats = {
    total: inventoryData.length,
    lowStock: inventoryData.filter((i) => i.status === "low").length,
    expiring: inventoryData.filter((i) => i.status === "expiring").length,
    expired: inventoryData.filter((i) => i.status === "expired").length,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">Track and manage your product inventory</p>
        </div>
        <Button className="mt-2 sm:mt-0">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Items", value: stats.total, icon: Package, variant: "default" },
          { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, variant: "warning" },
          { label: "Expiring Soon", value: stats.expiring, icon: Clock, variant: "danger" },
          { label: "Expired", value: stats.expired, icon: AlertTriangle, variant: "danger" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  stat.variant === "default" && "bg-primary/10",
                  stat.variant === "warning" && "bg-accent/10",
                  stat.variant === "danger" && "bg-destructive/10"
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    stat.variant === "default" && "text-primary",
                    stat.variant === "warning" && "text-accent",
                    stat.variant === "danger" && "text-destructive"
                  )} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 w-full sm:w-72 h-9 bg-secondary border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                    activeFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="hidden md:grid grid-cols-7 gap-4 border-b border-border pb-3 mb-1">
            <button onClick={() => setSortBy("name")} className="col-span-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              Product <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Category</span>
            <button onClick={() => setSortBy("quantity")} className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              Qty <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Value</span>
            <button onClick={() => setSortBy("expires")} className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              Expires <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</span>
          </div>

          {/* Table rows */}
          <div className="flex flex-col">
            {filtered.map((item) => {
              const status = statusConfig[item.status]
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 items-center py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground md:hidden">{item.category} - {item.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <Badge variant="secondary" className="text-[10px] font-normal">{item.category}</Badge>
                  </div>
                  <p className="hidden md:block text-sm font-semibold text-foreground text-center">
                    {item.quantity} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
                  </p>
                  <p className="hidden md:block text-sm text-foreground text-center font-mono">
                    N{(item.quantity * item.costPerUnit).toLocaleString()}
                  </p>
                  <p className={cn(
                    "hidden md:block text-xs text-center font-medium",
                    item.expiresIn !== null && item.expiresIn <= 1 ? "text-destructive" :
                    item.expiresIn !== null && item.expiresIn <= 3 ? "text-accent" : "text-muted-foreground"
                  )}>
                    {item.expiresIn === 0 ? "Today" : item.expiresIn === null ? "--" : `${item.expiresIn}d`}
                  </p>
                  <div className="hidden md:flex justify-center">
                    <Badge variant="outline" className={cn("text-[10px] border", status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  {/* Mobile view extra info */}
                  <div className="flex items-center justify-between md:hidden">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{item.quantity} {item.unit}</span>
                      <Badge variant="outline" className={cn("text-[10px] border", status.color)}>{status.label}</Badge>
                    </div>
                    {item.expiresIn !== null && item.expiresIn <= 3 && (
                      <span className="text-xs text-destructive font-medium">
                        {item.expiresIn === 0 ? "Expires today" : `${item.expiresIn}d left`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
