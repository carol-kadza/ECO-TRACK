// "use client"

// import { useState } from "react"
// import {
//   Package,
//   Search,
//   Plus,
//   Filter,
//   ArrowUpDown,
//   MoreHorizontal,
//   AlertTriangle,
//   Clock,
//   Check,
// } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// type InventoryItem = {
//   id: number
//   name: string
//   category: string
//   quantity: number
//   unit: string
//   costPerUnit: number
//   expiresIn: number | null
//   status: "good" | "low" | "expiring" | "expired"
//   lastUpdated: string
// }

// const inventoryData: InventoryItem[] = [
//   { id: 1, name: "Sourdough Loaves", category: "Bread", quantity: 45, unit: "units", costPerUnit: 850, expiresIn: 2, status: "expiring", lastUpdated: "2 hrs ago" },
//   { id: 2, name: "Croissants", category: "Pastries", quantity: 78, unit: "units", costPerUnit: 450, expiresIn: 1, status: "expiring", lastUpdated: "1 hr ago" },
//   { id: 3, name: "Whole Wheat Flour", category: "Ingredients", quantity: 8, unit: "kg", costPerUnit: 1200, expiresIn: 30, status: "low", lastUpdated: "3 hrs ago" },
//   { id: 4, name: "Baguettes", category: "Bread", quantity: 62, unit: "units", costPerUnit: 650, expiresIn: 1, status: "expiring", lastUpdated: "2 hrs ago" },
//   { id: 5, name: "Fresh Cream", category: "Dairy", quantity: 12, unit: "liters", costPerUnit: 2800, expiresIn: 3, status: "good", lastUpdated: "4 hrs ago" },
//   { id: 6, name: "Butter", category: "Dairy", quantity: 25, unit: "kg", costPerUnit: 3500, expiresIn: 14, status: "good", lastUpdated: "1 day ago" },
//   { id: 7, name: "Cinnamon Rolls", category: "Pastries", quantity: 30, unit: "units", costPerUnit: 550, expiresIn: 2, status: "good", lastUpdated: "3 hrs ago" },
//   { id: 8, name: "Rye Bread", category: "Bread", quantity: 38, unit: "units", costPerUnit: 750, expiresIn: 3, status: "good", lastUpdated: "2 hrs ago" },
//   { id: 9, name: "Sugar", category: "Ingredients", quantity: 5, unit: "kg", costPerUnit: 800, expiresIn: 90, status: "low", lastUpdated: "2 days ago" },
//   { id: 10, name: "Danish Pastry", category: "Pastries", quantity: 22, unit: "units", costPerUnit: 600, expiresIn: 1, status: "expiring", lastUpdated: "1 hr ago" },
//   { id: 11, name: "Eggs", category: "Dairy", quantity: 120, unit: "units", costPerUnit: 150, expiresIn: 7, status: "good", lastUpdated: "5 hrs ago" },
//   { id: 12, name: "Yeast", category: "Ingredients", quantity: 3, unit: "packs", costPerUnit: 2200, expiresIn: 0, status: "expired", lastUpdated: "1 day ago" },
// ]

// const filters = ["All", "Bread", "Pastries", "Dairy", "Ingredients"]

// const statusConfig = {
//   good: { label: "In Stock", color: "bg-primary/10 text-primary border-primary/20" },
//   low: { label: "Low Stock", color: "bg-accent/10 text-accent border-accent/20" },
//   expiring: { label: "Expiring Soon", color: "bg-destructive/10 text-destructive border-destructive/20" },
//   expired: { label: "Expired", color: "bg-destructive text-destructive-foreground border-destructive" },
// }

// export default function InventoryPage() {
//   const [search, setSearch] = useState("")
//   const [activeFilter, setActiveFilter] = useState("All")
//   const [sortBy, setSortBy] = useState<"name" | "quantity" | "expires">("name")

//   const filtered = inventoryData
//     .filter((item) => {
//       const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
//       const matchesFilter = activeFilter === "All" || item.category === activeFilter
//       return matchesSearch && matchesFilter
//     })
//     .sort((a, b) => {
//       if (sortBy === "name") return a.name.localeCompare(b.name)
//       if (sortBy === "quantity") return a.quantity - b.quantity
//       return (a.expiresIn ?? 999) - (b.expiresIn ?? 999)
//     })

//   const stats = {
//     total: inventoryData.length,
//     lowStock: inventoryData.filter((i) => i.status === "low").length,
//     expiring: inventoryData.filter((i) => i.status === "expiring").length,
//     expired: inventoryData.filter((i) => i.status === "expired").length,
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
//           <p className="text-sm text-muted-foreground">Track and manage your product inventory</p>
//         </div>
//         <Button className="mt-2 sm:mt-0">
//           <Plus className="h-4 w-4" />
//           Add Product
//         </Button>
//       </div>

//       {/* Quick stats */}
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//         {[
//           { label: "Total Items", value: stats.total, icon: Package, variant: "default" },
//           { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, variant: "warning" },
//           { label: "Expiring Soon", value: stats.expiring, icon: Clock, variant: "danger" },
//           { label: "Expired", value: stats.expired, icon: AlertTriangle, variant: "danger" },
//         ].map((stat) => {
//           const Icon = stat.icon
//           return (
//             <Card key={stat.label}>
//               <CardContent className="flex items-center gap-3 p-4">
//                 <div className={cn(
//                   "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//                   stat.variant === "default" && "bg-primary/10",
//                   stat.variant === "warning" && "bg-accent/10",
//                   stat.variant === "danger" && "bg-destructive/10"
//                 )}>
//                   <Icon className={cn(
//                     "h-4 w-4",
//                     stat.variant === "default" && "text-primary",
//                     stat.variant === "warning" && "text-accent",
//                     stat.variant === "danger" && "text-destructive"
//                   )} />
//                 </div>
//                 <div>
//                   <p className="text-lg font-bold text-foreground">{stat.value}</p>
//                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Filters and search */}
//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search products..."
//                 className="pl-9 w-full sm:w-72 h-9 bg-secondary border-transparent"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center gap-2 overflow-x-auto">
//               {filters.map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setActiveFilter(f)}
//                   className={cn(
//                     "rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
//                     activeFilter === f
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-secondary text-muted-foreground hover:text-foreground"
//                   )}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Table header */}
//           <div className="hidden md:grid grid-cols-7 gap-4 border-b border-border pb-3 mb-1">
//             <button onClick={() => setSortBy("name")} className="col-span-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
//               Product <ArrowUpDown className="h-3 w-3" />
//             </button>
//             <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Category</span>
//             <button onClick={() => setSortBy("quantity")} className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
//               Qty <ArrowUpDown className="h-3 w-3" />
//             </button>
//             <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Value</span>
//             <button onClick={() => setSortBy("expires")} className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
//               Expires <ArrowUpDown className="h-3 w-3" />
//             </button>
//             <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</span>
//           </div>

//           {/* Table rows */}
//           <div className="flex flex-col">
//             {filtered.map((item) => {
//               const status = statusConfig[item.status]
//               return (
//                 <div
//                   key={item.id}
//                   className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 items-center py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/50 -mx-2 px-2 rounded-lg transition-colors"
//                 >
//                   <div className="col-span-2 flex items-center gap-3">
//                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
//                       <Package className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-foreground">{item.name}</p>
//                       <p className="text-[10px] text-muted-foreground md:hidden">{item.category} - {item.lastUpdated}</p>
//                     </div>
//                   </div>
//                   <div className="hidden md:flex justify-center">
//                     <Badge variant="secondary" className="text-[10px] font-normal">{item.category}</Badge>
//                   </div>
//                   <p className="hidden md:block text-sm font-semibold text-foreground text-center">
//                     {item.quantity} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
//                   </p>
//                   <p className="hidden md:block text-sm text-foreground text-center font-mono">
//                     N{(item.quantity * item.costPerUnit).toLocaleString()}
//                   </p>
//                   <p className={cn(
//                     "hidden md:block text-xs text-center font-medium",
//                     item.expiresIn !== null && item.expiresIn <= 1 ? "text-destructive" :
//                     item.expiresIn !== null && item.expiresIn <= 3 ? "text-accent" : "text-muted-foreground"
//                   )}>
//                     {item.expiresIn === 0 ? "Today" : item.expiresIn === null ? "--" : `${item.expiresIn}d`}
//                   </p>
//                   <div className="hidden md:flex justify-center">
//                     <Badge variant="outline" className={cn("text-[10px] border", status.color)}>
//                       {status.label}
//                     </Badge>
//                   </div>
//                   {/* Mobile view extra info */}
//                   <div className="flex items-center justify-between md:hidden">
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm font-semibold text-foreground">{item.quantity} {item.unit}</span>
//                       <Badge variant="outline" className={cn("text-[10px] border", status.color)}>{status.label}</Badge>
//                     </div>
//                     {item.expiresIn !== null && item.expiresIn <= 3 && (
//                       <span className="text-xs text-destructive font-medium">
//                         {item.expiresIn === 0 ? "Expires today" : `${item.expiresIn}d left`}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {filtered.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
//               <p className="text-sm font-medium text-foreground">No products found</p>
//               <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





// "use client"

// import { useState, useRef, useMemo } from "react"
// import {
//   Package, Search, Plus, ArrowUpDown, AlertTriangle,
//   Clock, Upload, FileSpreadsheet, RefreshCw, Trash2,
//   Pencil, X, Check, ChevronDown, Link2, History, Save,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
//   DialogFooter, DialogDescription,
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { cn } from "@/lib/utils"
// import { useInventory } from "@/lib/hooks/use-inventory"
// import type { InventoryItem } from "@/lib/hooks/use-inventory"

// // ── Config ───────────────────────────────────────────────────────
// const statusConfig = {
//   good:     { label: "In Stock",      color: "bg-primary/10 text-primary border-primary/20"            },
//   low:      { label: "Low Stock",     color: "bg-amber-500/10 text-amber-600 border-amber-500/20"      },
//   expiring: { label: "Expiring Soon", color: "bg-destructive/10 text-destructive border-destructive/20" },
//   expired:  { label: "Expired",       color: "bg-destructive text-destructive-foreground"               },
// }
// const CATEGORIES = ["Bread", "Pastries", "Dairy", "Ingredients", "Beverages", "Prepared", "Other"]
// const UNITS      = ["units", "kg", "g", "liters", "ml", "packs", "boxes", "bags"]
// const SALES_COLS = ["product_name", "quantity", "revenue", "date"]
// const INV_COLS   = ["product_name", "category", "unit", "quantity", "unit_cost", "expiry_date", "batch_number"]

// function formatCurrency(val: number) {
//   if (val >= 1_000_000) return `N${(val / 1_000_000).toFixed(1)}M`
//   if (val >= 1_000)     return `N${(val / 1_000).toFixed(0)}K`
//   return `N${val.toFixed(0)}`
// }
// function formatTime(iso: string | null) {
//   if (!iso) return "—"
//   const diff = Date.now() - new Date(iso).getTime()
//   const mins = Math.floor(diff / 60000)
//   if (mins < 1)  return "Just now"
//   if (mins < 60) return `${mins}m ago`
//   const hrs = Math.floor(mins / 60)
//   if (hrs < 24)  return `${hrs}h ago`
//   return `${Math.floor(hrs / 24)}d ago`
// }
// function parseCSV(text: string): Record<string, string>[] {
//   const lines = text.trim().split("\n").filter(Boolean)
//   if (lines.length < 2) return []
//   const headers = lines[0].split(",").map((h) =>
//     h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, "")
//   )
//   return lines.slice(1).map((line) => {
//     const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
//     return Object.fromEntries(headers.map((h, i) => [h, vals[i] || ""]))
//   })
// }

// // ── Inline editable row ──────────────────────────────────────────
// function EditableRow({
//   item,
//   onSave,
//   onDelete,
//   onCancel,
// }: {
//   item: InventoryItem
//   onSave: (productId: number, updates: Partial<InventoryItem>) => Promise<void>
//   onDelete: (item: InventoryItem) => void
//   onCancel: () => void
// }) {
//   const [saving, setSaving] = useState(false)
//   const [form, setForm] = useState({
//     name:               item.name,
//     category:           item.category,
//     unit:               item.unit,
//     unit_cost:          item.unit_cost.toString(),
//     shelf_life_days:    item.shelf_life_days?.toString() || "",
//     reorder_threshold:  item.reorder_threshold.toString(),
//   })
//   const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       await onSave(item.product_id, {
//         name:              form.name,
//         category:          form.category,
//         unit:              form.unit,
//         unit_cost:         Number(form.unit_cost) || 0,
//         shelf_life_days:   form.shelf_life_days ? Number(form.shelf_life_days) : null,
//         reorder_threshold: Number(form.reorder_threshold) || 10,
//       } as any)
//       onCancel()
//     } catch (e: any) { alert(e.message) }
//     finally { setSaving(false) }
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-3 items-center py-3 border-b border-primary/30 bg-primary/5 -mx-2 px-2 rounded-lg">
//       {/* Name + category inline */}
//       <div className="col-span-2 flex flex-col gap-1.5">
//         <Input value={form.name} onChange={(e) => set("name", e.target.value)}
//           className="h-8 text-sm bg-background" placeholder="Product name" />
//         <select value={form.category} onChange={(e) => set("category", e.target.value)}
//           className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
//           {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//         </select>
//       </div>

//       {/* Unit */}
//       <div className="hidden md:block">
//         <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
//           className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
//           {UNITS.map((u) => <option key={u}>{u}</option>)}
//         </select>
//       </div>

//       {/* Qty — read only in inline edit (quantity is in inventory table, not products) */}
//       <p className="hidden md:block text-sm font-semibold text-foreground text-center">
//         {item.quantity} <span className="text-xs text-muted-foreground">{item.unit}</span>
//       </p>

//       {/* Unit cost */}
//       <div className="hidden md:block">
//         <Input value={form.unit_cost} onChange={(e) => set("unit_cost", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Cost" type="number" />
//       </div>

//       {/* Shelf life */}
//       <div className="hidden md:block">
//         <Input value={form.shelf_life_days} onChange={(e) => set("shelf_life_days", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Days" type="number" />
//       </div>

//       {/* Reorder threshold */}
//       <div className="hidden md:block">
//         <Input value={form.reorder_threshold} onChange={(e) => set("reorder_threshold", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Min qty" type="number" />
//       </div>

//       {/* Save / cancel / delete */}
//       <div className="flex items-center justify-end gap-1">
//         <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"
//           onClick={() => onDelete(item)} title="Delete product">
//           <Trash2 className="h-3.5 w-3.5" />
//         </Button>
//         <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={onCancel} title="Cancel">
//           <X className="h-3.5 w-3.5" />
//         </Button>
//         <Button size="icon" className="h-7 w-7" onClick={handleSave} disabled={saving} title="Save">
//           {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
//         </Button>
//       </div>
//     </div>
//   )
// }

// // ── Add Product row (inline at top of table) ─────────────────────
// function AddRow({ onSave, onCancel }: {
//   onSave: (product: any, inventory: any) => Promise<void>
//   onCancel: () => void
// }) {
//   const [saving, setSaving] = useState(false)
//   const [form, setForm] = useState({
//     name: "", category: "Bread", unit: "units",
//     unit_cost: "", shelf_life_days: "", reorder_threshold: "10",
//     quantity: "", expiry_date: "",
//   })
//   const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

//   const handleSave = async () => {
//     if (!form.name.trim()) return
//     setSaving(true)
//     try {
//       await onSave(
//         {
//           name: form.name, category: form.category, unit: form.unit,
//           unit_cost: Number(form.unit_cost) || 0,
//           shelf_life_days: form.shelf_life_days ? Number(form.shelf_life_days) : null,
//           reorder_threshold: Number(form.reorder_threshold) || 10,
//         },
//         { quantity: Number(form.quantity) || 0, expiry_date: form.expiry_date || null }
//       )
//       onCancel()
//     } catch (e: any) { alert(e.message) }
//     finally { setSaving(false) }
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-3 items-center py-3 border-b border-primary/30 bg-primary/5 -mx-2 px-2 rounded-lg mb-1">
//       <div className="col-span-2 flex flex-col gap-1.5">
//         <Input autoFocus value={form.name} onChange={(e) => set("name", e.target.value)}
//           className="h-8 text-sm bg-background" placeholder="Product name *" />
//         <select value={form.category} onChange={(e) => set("category", e.target.value)}
//           className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
//           {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//         </select>
//       </div>
//       <div className="hidden md:block">
//         <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
//           className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
//           {UNITS.map((u) => <option key={u}>{u}</option>)}
//         </select>
//       </div>
//       <div className="hidden md:flex flex-col gap-1">
//         <Input value={form.quantity} onChange={(e) => set("quantity", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Opening qty" type="number" />
//       </div>
//       <div className="hidden md:block">
//         <Input value={form.unit_cost} onChange={(e) => set("unit_cost", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Cost/unit" type="number" />
//       </div>
//       <div className="hidden md:block">
//         <Input value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)}
//           className="h-8 text-xs bg-background" type="date" />
//       </div>
//       <div className="hidden md:block">
//         <Input value={form.reorder_threshold} onChange={(e) => set("reorder_threshold", e.target.value)}
//           className="h-8 text-xs bg-background" placeholder="Reorder at" type="number" />
//       </div>
//       <div className="flex items-center justify-end gap-1">
//         <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={onCancel}>
//           <X className="h-3.5 w-3.5" />
//         </Button>
//         <Button size="icon" className="h-7 w-7" onClick={handleSave} disabled={saving || !form.name.trim()}>
//           {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
//         </Button>
//       </div>
//     </div>
//   )
// }

// // ── Import Dialog ────────────────────────────────────────────────
// function ImportDialog({ open, onClose, onImport }: {
//   open: boolean
//   onClose: () => void
//   onImport: (type: "sales" | "inventory", source: string, rows: any[]) => Promise<{ imported: number; failed: number }>
// }) {
//   const fileRef = useRef<HTMLInputElement>(null)
//   const [importType, setImportType] = useState<"sales" | "inventory">("sales")
//   const [file, setFile] = useState<File | null>(null)
//   const [preview, setPreview] = useState<any[]>([])
//   const [importing, setImporting] = useState(false)
//   const [result, setResult] = useState<{ imported: number; failed: number } | null>(null)
//   const [error, setError] = useState("")

//   const reset = () => { setFile(null); setPreview([]); setResult(null); setError("") }

//   const handleFile = async (f: File) => {
//     setFile(f); setResult(null); setError("")
//     try {
//       let rows: any[] = []
//       if (f.name.endsWith(".csv")) {
//         rows = parseCSV(await f.text())
//       } else if (f.name.match(/\.xlsx?$/)) {
//         const XLSX = await import("xlsx")
//         const wb = XLSX.read(await f.arrayBuffer(), { type: "array" })
//         const ws = wb.Sheets[wb.SheetNames[0]]
//         rows = (XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]).map((row: any) =>
//           Object.fromEntries(Object.entries(row).map(([k, v]) => [
//             k.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, ""), v,
//           ]))
//         )
//       } else { setError("Please upload a .csv, .xlsx or .xls file."); return }
//       setPreview(rows.slice(0, 3))
//     } catch (e: any) { setError("Failed to parse file: " + e.message) }
//   }

//   const handleImport = async () => {
//     if (!file || !preview.length) return
//     setImporting(true); setError("")
//     try {
//       let rows: any[] = []
//       if (file.name.endsWith(".csv")) {
//         rows = parseCSV(await file.text())
//       } else {
//         const XLSX = await import("xlsx")
//         const wb = XLSX.read(await file.arrayBuffer(), { type: "array" })
//         const ws = wb.Sheets[wb.SheetNames[0]]
//         rows = (XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]).map((row: any) =>
//           Object.fromEntries(Object.entries(row).map(([k, v]) => [
//             k.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, ""), v,
//           ]))
//         )
//       }
//       const res = await onImport(importType, file.name.endsWith(".csv") ? "csv" : "excel", rows)
//       setResult(res)
//     } catch (e: any) { setError(e.message) }
//     finally { setImporting(false) }
//   }

//   const downloadTemplate = () => {
//     const cols = importType === "sales" ? SALES_COLS : INV_COLS
//     const sample = importType === "sales"
//       ? "Sourdough Loaves,12,10200,2024-02-01\nCroissants,25,11250,2024-02-01"
//       : "Sourdough Loaves,Bread,units,45,850,2024-02-05,BATCH001"
//     const blob = new Blob([cols.join(",") + "\n" + sample], { type: "text/csv" })
//     const a = document.createElement("a")
//     a.href = URL.createObjectURL(blob)
//     a.download = `ecotrack_${importType}_template.csv`
//     a.click()
//   }

//   return (
//     <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset() } }}>
//       <DialogContent className="max-w-xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2"><Upload className="h-4 w-4" /> Import Data</DialogTitle>
//           <DialogDescription>Upload a CSV or Excel file. Choose what you're importing first.</DialogDescription>
//         </DialogHeader>

//         {result ? (
//           <div className="flex flex-col items-center gap-3 py-6 text-center">
//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
//               <Check className="h-7 w-7 text-primary" />
//             </div>
//             <p className="text-base font-semibold">Import complete</p>
//             <p className="text-sm text-muted-foreground">
//               <span className="text-primary font-semibold">{result.imported} rows</span> imported successfully
//               {result.failed > 0 && <>, <span className="text-destructive font-semibold">{result.failed} failed</span> (product name not matched)</>}
//             </p>
//             <Button size="sm" onClick={() => { onClose(); reset() }}>Done</Button>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4 py-2">
//             {/* What are you importing */}
//             <div className="flex flex-col gap-2">
//               <Label>What are you importing?</Label>
//               <div className="grid grid-cols-2 gap-2">
//                 {(["sales", "inventory"] as const).map((t) => (
//                   <button key={t} onClick={() => setImportType(t)}
//                     className={cn("rounded-lg border p-3 text-left transition-colors",
//                       importType === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
//                     )}>
//                     <p className="text-sm font-semibold capitalize">{t} records</p>
//                     <p className="text-xs mt-0.5 font-normal opacity-70">
//                       {t === "sales" ? "product_name, quantity, revenue, date" : "product_name, category, unit, quantity, expiry_date"}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit">
//               <FileSpreadsheet className="h-3.5 w-3.5" />
//               Download {importType} template (.csv)
//             </button>

//             {/* Drop zone */}
//             <div onClick={() => fileRef.current?.click()}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
//               className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer py-8 transition-colors">
//               <Upload className="h-8 w-8 text-muted-foreground mb-2" />
//               {file
//                 ? <p className="text-sm font-medium text-foreground">{file.name}</p>
//                 : <>
//                     <p className="text-sm font-medium text-foreground">Drop your file here or click to browse</p>
//                     <p className="text-xs text-muted-foreground mt-1">Supports .csv, .xlsx, .xls</p>
//                   </>
//               }
//               <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
//                 onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
//             </div>

//             {/* Preview */}
//             {preview.length > 0 && (
//               <div className="rounded-lg border border-border overflow-hidden">
//                 <div className="bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground">
//                   Preview — first {preview.length} rows
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-xs">
//                     <thead>
//                       <tr className="border-b border-border">
//                         {Object.keys(preview[0]).map((k) => (
//                           <th key={k} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{k}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {preview.map((row, i) => (
//                         <tr key={i} className="border-b border-border/50 last:border-0">
//                           {Object.values(row).map((v: any, j) => (
//                             <td key={j} className="px-3 py-2 text-foreground whitespace-nowrap">{v}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         )}

//         {!result && (
//           <DialogFooter>
//             <Button variant="outline" onClick={() => { onClose(); reset() }}>Cancel</Button>
//             <Button onClick={handleImport} disabled={importing || !file || !preview.length}>
//               {importing
//                 ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />Importing...</>
//                 : <><Upload className="h-3.5 w-3.5 mr-1" />Import</>}
//             </Button>
//           </DialogFooter>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

// // ── Square Connect Dialog ────────────────────────────────────────
// function SquareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
//   const [step, setStep] = useState<"connect" | "instructions">("connect")
//   const [apiKey, setApiKey] = useState("")
//   const [connecting, setConnecting] = useState(false)

//   const handleConnect = async () => {
//     if (!apiKey) return
//     setConnecting(true)
//     await new Promise((r) => setTimeout(r, 1500))
//     setConnecting(false)
//     setStep("instructions")
//   }

//   return (
//     <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setStep("connect"); setApiKey("") } }}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white text-xs font-bold">S</div>
//             Connect Square POS
//           </DialogTitle>
//           <DialogDescription>Sync your Square sales directly into EcoTrack.</DialogDescription>
//         </DialogHeader>

//         {step === "connect" ? (
//           <div className="flex flex-col gap-4 py-2">
//             <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground leading-relaxed">
//               EcoTrack will pull your Square sales history to power demand forecasting and waste tracking. No payment data is stored.
//             </div>
//             <div className="flex flex-col gap-2">
//               <Label>Square Access Token</Label>
//               <Input placeholder="EAAAl..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
//               <p className="text-xs text-muted-foreground">
//                 Find this in <span className="font-medium text-foreground">Square Developer Dashboard → Applications → your app → Credentials</span>
//               </p>
//             </div>
//             <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
//               <p className="font-semibold text-foreground text-xs">What gets synced:</p>
//               <p>✓ Sales transactions (product, quantity, revenue, date)</p>
//               <p>✓ Item catalog (product names and categories)</p>
//               <p>✗ Customer data, payment details, or refunds</p>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={onClose}>Cancel</Button>
//               <Button onClick={handleConnect} disabled={!apiKey || connecting}>
//                 {connecting ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />Connecting...</> : "Connect Square"}
//               </Button>
//             </DialogFooter>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4 py-2">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
//               <Check className="h-6 w-6 text-primary" />
//             </div>
//             <p className="text-center text-sm font-semibold text-foreground">Square connected!</p>
//             <p className="text-center text-xs text-muted-foreground">
//               Full Square sync is coming in the next update. For now, export your sales from Square as CSV and use the Import button — EcoTrack will map the columns automatically.
//             </p>
//             <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground">
//               <p className="font-semibold text-foreground mb-1">To export from Square:</p>
//               <p>1. Go to Square Dashboard → Reports → Sales Summary</p>
//               <p>2. Set your date range → click Export</p>
//               <p>3. Come back here → Import → Sales records</p>
//             </div>
//             <Button onClick={onClose}>Got it</Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

// // ── Delete Confirm ───────────────────────────────────────────────
// function DeleteDialog({ item, onClose, onConfirm }: {
//   item: InventoryItem | null; onClose: () => void; onConfirm: () => Promise<void>
// }) {
//   const [deleting, setDeleting] = useState(false)
//   const handle = async () => { setDeleting(true); await onConfirm(); setDeleting(false); onClose() }
//   return (
//     <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="max-w-sm">
//         <DialogHeader>
//           <DialogTitle>Delete product?</DialogTitle>
//           <DialogDescription>
//             This will permanently delete <span className="font-semibold text-foreground">{item?.name}</span> and all its inventory records. Cannot be undone.
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button variant="destructive" onClick={handle} disabled={deleting}>
//             {deleting ? "Deleting..." : "Yes, delete"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // ── Main Page ────────────────────────────────────────────────────
// export default function InventoryPage() {
//   const { items, importLogs, loading, error, refetch, addProduct, updateProduct, deleteProduct, importData } = useInventory()

//   const [search, setSearch]               = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("All")
//   const [statusFilter, setStatusFilter]   = useState("All")
//   const [sortBy, setSortBy]               = useState<"name" | "quantity" | "expires" | "value">("name")
//   const [sortDir, setSortDir]             = useState<"asc" | "desc">("asc")
//   const [editingId, setEditingId]         = useState<number | null>(null)  // product_id being inline-edited
//   const [addingNew, setAddingNew]         = useState(false)
//   const [deleteItem, setDeleteItem]       = useState<InventoryItem | null>(null)
//   const [showImport, setShowImport]       = useState(false)
//   const [showSquare, setShowSquare]       = useState(false)

//   const categories = useMemo(() => ["All", ...[...new Set(items.map((i) => i.category))].sort()], [items])

//   const toggleSort = (col: typeof sortBy) => {
//     if (sortBy === col) setSortDir((d) => d === "asc" ? "desc" : "asc")
//     else { setSortBy(col); setSortDir("asc") }
//   }

//   const filtered = useMemo(() => items
//     .filter((item) => {
//       const q = search.toLowerCase()
//       return (!q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
//         && (categoryFilter === "All" || item.category === categoryFilter)
//         && (statusFilter === "All" || item.status === statusFilter)
//     })
//     .sort((a, b) => {
//       let cmp = 0
//       if (sortBy === "name")     cmp = a.name.localeCompare(b.name)
//       if (sortBy === "quantity") cmp = a.quantity - b.quantity
//       if (sortBy === "expires")  cmp = (a.expires_in ?? 9999) - (b.expires_in ?? 9999)
//       if (sortBy === "value")    cmp = a.total_value - b.total_value
//       return sortDir === "asc" ? cmp : -cmp
//     }), [items, search, categoryFilter, statusFilter, sortBy, sortDir])

//   const stats = useMemo(() => ({
//     total:      items.length,
//     lowStock:   items.filter((i) => i.status === "low").length,
//     expiring:   items.filter((i) => i.status === "expiring").length,
//     totalValue: items.reduce((s, i) => s + i.total_value, 0),
//   }), [items])

//   if (loading) return (
//     <div className="flex flex-col gap-6">
//       <div className="h-7 w-32 rounded bg-secondary animate-pulse" />
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//         {[1,2,3,4].map((i) => <Card key={i}><CardContent className="p-4"><div className="h-12 rounded bg-secondary animate-pulse" /></CardContent></Card>)}
//       </div>
//       <Card><CardContent className="p-5"><div className="h-64 rounded bg-secondary animate-pulse" /></CardContent></Card>
//     </div>
//   )

//   if (error) return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//           <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
//           <p className="text-base font-semibold text-foreground">Failed to load inventory</p>
//           <p className="text-sm text-muted-foreground mt-1">{error}</p>
//           <Button size="sm" className="mt-4" onClick={refetch}><RefreshCw className="h-3.5 w-3.5 mr-1" />Try again</Button>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
//           <p className="text-sm text-muted-foreground">Track and manage your product inventory</p>
//         </div>
//         <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={refetch} title="Refresh">
//             <RefreshCw className="h-3.5 w-3.5" />
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => setShowSquare(true)} className="gap-1.5">
//             <Link2 className="h-3.5 w-3.5" /> Connect Square
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => setShowImport(true)} className="gap-1.5">
//             <Upload className="h-3.5 w-3.5" /> Import File
//           </Button>
//           <Button size="sm" onClick={() => { setAddingNew(true); setEditingId(null) }} className="gap-1.5" disabled={addingNew}>
//             <Plus className="h-3.5 w-3.5" /> Add Product
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//         {[
//           { label: "Total Items",  value: stats.total,                  icon: Package,       variant: "default" },
//           { label: "Low Stock",    value: stats.lowStock,               icon: AlertTriangle, variant: "warning" },
//           { label: "Expiring",     value: stats.expiring,               icon: Clock,         variant: "danger"  },
//           { label: "Total Value",  value: formatCurrency(stats.totalValue), icon: Package,   variant: "default" },
//         ].map((stat) => {
//           const Icon = stat.icon
//           return (
//             <Card key={stat.label}>
//               <CardContent className="flex items-center gap-3 p-4">
//                 <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//                   stat.variant === "default" ? "bg-primary/10" : stat.variant === "warning" ? "bg-amber-500/10" : "bg-destructive/10"
//                 )}>
//                   <Icon className={cn("h-4 w-4",
//                     stat.variant === "default" ? "text-primary" : stat.variant === "warning" ? "text-amber-500" : "text-destructive"
//                   )} />
//                 </div>
//                 <div>
//                   <p className="text-lg font-bold text-foreground">{stat.value}</p>
//                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="inventory">
//         <TabsList className="mb-4">
//           <TabsTrigger value="inventory">Products ({items.length})</TabsTrigger>
//           <TabsTrigger value="imports" className="flex items-center gap-1.5">
//             <History className="h-3.5 w-3.5" /> Import History
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="inventory">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input placeholder="Search products..." className="pl-9 w-full sm:w-64 h-9 bg-secondary border-transparent"
//                     value={search} onChange={(e) => setSearch(e.target.value)} />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
//                         {categoryFilter === "All" ? "Category" : categoryFilter} <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       {categories.map((c) => (
//                         <DropdownMenuItem key={c} onClick={() => setCategoryFilter(c)}>
//                           {c} {categoryFilter === c && <Check className="ml-auto h-3.5 w-3.5" />}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
//                         {statusFilter === "All" ? "Status" : statusConfig[statusFilter as keyof typeof statusConfig]?.label} <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       {(["All", "good", "low", "expiring", "expired"] as const).map((s) => (
//                         <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
//                           {s === "All" ? "All statuses" : statusConfig[s].label}
//                           {statusFilter === s && <Check className="ml-auto h-3.5 w-3.5" />}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {/* Column headers */}
//               <div className="hidden md:grid grid-cols-8 gap-3 border-b border-border pb-3 mb-1">
//                 {[
//                   { label: "Product",   col: "name",     span: 2 },
//                   { label: "Unit",      col: null,       span: 1 },
//                   { label: "Qty",       col: "quantity", span: 1 },
//                   { label: "Cost",      col: "value",    span: 1 },
//                   { label: "Expires",   col: "expires",  span: 1 },
//                   { label: "Reorder",   col: null,       span: 1 },
//                   { label: "",          col: null,       span: 1 },
//                 ].map(({ label, col, span }) => (
//                   <div key={label} className={`col-span-${span}`}>
//                     {col ? (
//                       <button onClick={() => toggleSort(col as any)}
//                         className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
//                         {label} <ArrowUpDown className="h-3 w-3" />
//                       </button>
//                     ) : (
//                       <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Inline add row at top */}
//               {addingNew && (
//                 <AddRow
//                   onSave={async (product, inventory) => { await addProduct(product, inventory); setAddingNew(false) }}
//                   onCancel={() => setAddingNew(false)}
//                 />
//               )}

//               {/* Product rows */}
//               <div className="flex flex-col">
//                 {filtered.map((item) => {
//                   if (editingId === item.product_id) {
//                     return (
//                       <EditableRow
//                         key={item.product_id}
//                         item={item}
//                         onSave={updateProduct}
//                         onDelete={setDeleteItem}
//                         onCancel={() => setEditingId(null)}
//                       />
//                     )
//                   }

//                   const status = statusConfig[item.status]
//                   return (
//                     <div key={item.product_id}
//                       className="grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-3 items-center py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/40 -mx-2 px-2 rounded-lg transition-colors group">

//                       <div className="col-span-2 flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
//                           <Package className="h-4 w-4 text-muted-foreground" />
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
//                           <p className="text-[10px] text-muted-foreground">{item.category} · {formatTime(item.updated_at)}</p>
//                         </div>
//                       </div>

//                       <p className="hidden md:block text-xs text-muted-foreground">{item.unit}</p>

//                       <p className="hidden md:block text-sm font-semibold text-foreground">
//                         {item.quantity}
//                       </p>

//                       <p className="hidden md:block text-xs text-foreground font-mono">
//                         {formatCurrency(item.unit_cost)}/u
//                       </p>

//                       <p className={cn("hidden md:block text-xs font-medium",
//                         item.expires_in !== null && item.expires_in <= 0 ? "text-destructive" :
//                         item.expires_in !== null && item.expires_in <= 3 ? "text-amber-500" : "text-muted-foreground"
//                       )}>
//                         {item.expires_in === null ? "—" :
//                          item.expires_in <= 0 ? "Expired" :
//                          item.expires_in === 1 ? "Tomorrow" : `${item.expires_in}d`}
//                       </p>

//                       <p className="hidden md:block text-xs text-muted-foreground">
//                         ≤ {item.reorder_threshold} {item.unit}
//                       </p>

//                       {/* Status + edit button */}
//                       <div className="hidden md:flex items-center justify-end gap-2">
//                         <Badge variant="outline" className={cn("text-[10px] border shrink-0", status.color)}>
//                           {status.label}
//                         </Badge>
//                         <Button variant="ghost" size="icon"
//                           className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
//                           onClick={() => { setEditingId(item.product_id); setAddingNew(false) }}
//                           title="Edit inline">
//                           <Pencil className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>

//                       {/* Mobile */}
//                       <div className="flex items-center justify-between md:hidden">
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-semibold">{item.quantity} {item.unit}</span>
//                           <Badge variant="outline" className={cn("text-[10px] border", status.color)}>{status.label}</Badge>
//                         </div>
//                         <Button variant="ghost" size="icon" className="h-7 w-7"
//                           onClick={() => setEditingId(item.product_id)}>
//                           <Pencil className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//                     </div>
//                   )
//                 })}

//                 {filtered.length === 0 && !addingNew && (
//                   <div className="flex flex-col items-center justify-center py-16 text-center">
//                     <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
//                     <p className="text-sm font-medium text-foreground">
//                       {items.length === 0 ? "No products yet" : "No products match your filters"}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {items.length === 0 ? "Add your first product or import from a file." : "Try adjusting your search or filters."}
//                     </p>
//                     {items.length === 0 && (
//                       <div className="flex items-center gap-2 mt-4">
//                         <Button size="sm" onClick={() => setAddingNew(true)}>
//                           <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
//                         </Button>
//                         <Button size="sm" variant="outline" onClick={() => setShowImport(true)}>
//                           <Upload className="h-3.5 w-3.5 mr-1" /> Import File
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="imports">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base font-semibold">Import History</CardTitle>
//               <CardDescription>Recent file imports and sync logs</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {importLogs.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center">
//                   <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
//                   <p className="text-sm font-medium text-foreground">No imports yet</p>
//                   <p className="text-xs text-muted-foreground mt-1">Import a CSV or Excel file to see the log here.</p>
//                 </div>
//               ) : importLogs.map((log) => (
//                 <div key={log.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 mb-2 last:mb-0">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
//                       <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-foreground capitalize">
//                         {log.import_type} import · <span className="text-muted-foreground font-normal">{log.source}</span>
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {log.rows_imported} imported{log.rows_failed > 0 && `, ${log.rows_failed} failed`} · {formatTime(log.created_at)}
//                       </p>
//                     </div>
//                   </div>
//                   <Badge variant={log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"}
//                     className="text-[10px] capitalize">{log.status}</Badge>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Dialogs */}
//       <ImportDialog open={showImport} onClose={() => setShowImport(false)}
//         onImport={async (type, source, rows) => importData(type, source, rows)} />
//       <SquareDialog open={showSquare} onClose={() => setShowSquare(false)} />
//       <DeleteDialog item={deleteItem} onClose={() => setDeleteItem(null)}
//         onConfirm={async () => { if (deleteItem) await deleteProduct(deleteItem.product_id) }} />
//     </div>
//   )
// }




"use client"

import { useState, useRef, useMemo } from "react"
import {
  Package, Search, Plus, ArrowUpDown, AlertTriangle,
  Clock, Upload, FileSpreadsheet, RefreshCw, Trash2,
  Pencil, X, Check, ChevronDown, Link2, History, Save,
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useInventory } from "@/lib/hooks/use-inventory"
import type { InventoryItem } from "@/lib/hooks/use-inventory"

// ── Config ───────────────────────────────────────────────────────
const statusConfig = {
  good:     { label: "In Stock",      color: "bg-primary/10 text-primary border-primary/20"             },
  low:      { label: "Low Stock",     color: "bg-amber-500/10 text-amber-600 border-amber-500/20"       },
  expiring: { label: "Expiring Soon", color: "bg-destructive/10 text-destructive border-destructive/20" },
  expired:  { label: "Expired",       color: "bg-destructive text-destructive-foreground border-destructive" },
}
const CATEGORIES = ["Bread", "Pastries", "Dairy", "Ingredients", "Beverages", "Prepared", "Other"]
const UNITS = ["units", "kg", "g", "liters", "ml", "packs", "boxes", "bags"]

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `N${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000)     return `N${(val / 1_000).toFixed(0)}K`
  return `N${val.toFixed(0)}`
}
function formatTime(iso: string | null) {
  if (!iso) return "—"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n").filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, "")
  )
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]))
  })
}

// ── Add Product Modal ────────────────────────────────────────────
function AddProductModal({
  open, onClose, onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (product: any, inventory: any) => Promise<void>
}) {
  const empty = {
    name: "", category: "Bread", unit: "units",
    unit_cost: "", shelf_life_days: "", reorder_threshold: "10",
    quantity: "", expiry_date: "", batch_number: "",
  }
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleClose = () => { setForm(empty); setSaveError(""); onClose() }

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError("Product name is required."); return }
    setSaving(true)
    setSaveError("")
    try {
      await onSave(
        {
          name: form.name.trim(),
          category: form.category,
          unit: form.unit,
          unit_cost: parseFloat(form.unit_cost) || 0,
          shelf_life_days: form.shelf_life_days ? parseInt(form.shelf_life_days) : null,
          reorder_threshold: parseInt(form.reorder_threshold) || 10,
        },
        {
          quantity: parseInt(form.quantity) || 0,
          expiry_date: form.expiry_date || null,
          batch_number: form.batch_number.trim() || null,
        }
      )
      handleClose()
    } catch (e: any) {
      setSaveError(e.message || "Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details. Opening stock is optional — you can add stock later.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-1">
          {/* Product info section */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Info</p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-name">Product name <span className="text-destructive">*</span></Label>
              <Input id="p-name" placeholder="e.g. Sourdough Loaves"
                value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Unit of measure</Label>
                <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-cost">Cost per unit (N)</Label>
                <Input id="p-cost" type="number" min="0" placeholder="0.00"
                  value={form.unit_cost} onChange={(e) => set("unit_cost", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-shelf">Shelf life (days)</Label>
                <Input id="p-shelf" type="number" min="1" placeholder="e.g. 3"
                  value={form.shelf_life_days} onChange={(e) => set("shelf_life_days", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-reorder">Reorder when stock falls below</Label>
              <div className="flex items-center gap-2">
                <Input id="p-reorder" type="number" min="0" placeholder="10" className="w-32"
                  value={form.reorder_threshold} onChange={(e) => set("reorder_threshold", e.target.value)} />
                <span className="text-sm text-muted-foreground">{form.unit}</span>
              </div>
            </div>
          </div>

          {/* Opening stock section */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Opening Stock <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-qty">Quantity on hand</Label>
                <div className="flex items-center gap-2">
                  <Input id="p-qty" type="number" min="0" placeholder="0"
                    value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
                  <span className="text-xs text-muted-foreground shrink-0">{form.unit}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-expiry">Expiry date</Label>
                <Input id="p-expiry" type="date"
                  value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-batch">Batch / lot number</Label>
              <Input id="p-batch" placeholder="e.g. BATCH-001 (optional)"
                value={form.batch_number} onChange={(e) => set("batch_number", e.target.value)} />
            </div>
          </div>

          {saveError && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{saveError}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
            {saving ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</> : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Import Dialog ────────────────────────────────────────────────
function ImportDialog({ open, onClose, onImport }: {
  open: boolean
  onClose: () => void
  onImport: (type: "sales" | "inventory", source: string, rows: any[]) => Promise<{ imported: number; failed: number; errors?: string[] }>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importType, setImportType] = useState<"sales" | "inventory">("sales")
  const [fileName, setFileName]   = useState("")
  const [parsedRows, setParsedRows] = useState<any[]>([])   // ← store parsed rows in state, not the File object
  const [preview, setPreview]     = useState<any[]>([])
  const [parseError, setParseError] = useState("")
  const [importing, setImporting] = useState(false)
  const [result, setResult]       = useState<{ imported: number; failed: number; errors?: string[] } | null>(null)
  const [importError, setImportError] = useState("")

  const reset = () => {
    setFileName(""); setParsedRows([]); setPreview([])
    setParseError(""); setResult(null); setImportError("")
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleFile = async (f: File) => {
    reset()
    setFileName(f.name)
    try {
      let rows: any[] = []

      if (f.name.toLowerCase().endsWith(".csv")) {
        const text = await f.text()
        rows = parseCSV(text)
      } else if (f.name.toLowerCase().match(/\.xlsx?$/)) {
        const XLSX = await import("xlsx")
        const buf = await f.arrayBuffer()
        const wb = XLSX.read(buf, { type: "array" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]
        rows = rawRows.map((row: any) =>
          Object.fromEntries(
            Object.entries(row).map(([k, v]) => [
              k.toString().toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z_]/g, ""),
              v,
            ])
          )
        )
      } else {
        setParseError("Unsupported file. Please upload a .csv, .xlsx, or .xls file.")
        return
      }

      if (rows.length === 0) {
        setParseError("File appears to be empty or has no data rows.")
        return
      }

      setParsedRows(rows)                    // ← save all rows to state
      setPreview(rows.slice(0, 3))           // ← show first 3 for preview
    } catch (e: any) {
      setParseError("Could not read file: " + e.message)
    }
  }

  const handleImport = async () => {
    if (!parsedRows.length) return
    setImporting(true)
    setImportError("")
    try {
      const source = fileName.toLowerCase().endsWith(".csv") ? "csv" : "excel"
      const res = await onImport(importType, source, parsedRows)  // ← use parsedRows from state
      setResult(res)
    } catch (e: any) {
      setImportError(e.message || "Import failed. Please try again.")
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const isSales = importType === "sales"
    const header = isSales
      ? "product_name,quantity,revenue,date"
      : "product_name,category,unit,quantity,unit_cost,expiry_date,batch_number"
    const sample = isSales
      ? "Sourdough Loaves,12,10200,2024-02-01\nCroissants,25,11250,2024-02-01"
      : "Sourdough Loaves,Bread,units,45,850,2024-02-05,BATCH001\nCroissants,Pastries,units,78,450,2024-02-04,BATCH002"
    const blob = new Blob([header + "\n" + sample], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `ecotrack_${importType}_template.csv`
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset() } }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import Data
          </DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import sales or inventory records.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Import complete</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{result.imported} row{result.imported !== 1 ? "s" : ""}</span> imported successfully
                {result.failed > 0 && (
                  <>, <span className="text-destructive font-semibold">{result.failed} failed</span></>
                )}
              </p>
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-3 text-left w-full">
                <p className="text-xs font-semibold text-destructive mb-1">Failed rows (first 5):</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-destructive/80">• {e}</p>
                ))}
              </div>
            )}
            <Button onClick={() => { onClose(); reset() }}>Done</Button>
          </div>
        ) : (
          /* ── Upload state ── */
          <div className="flex flex-col gap-5 py-2">

            {/* Step 1 — choose type */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1 — What are you importing?</p>
              <div className="grid grid-cols-2 gap-2">
                {(["sales", "inventory"] as const).map((t) => (
                  <button key={t} onClick={() => { setImportType(t); reset() }}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      importType === t
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}>
                    <p className={cn("text-sm font-semibold capitalize", importType === t ? "text-primary" : "text-foreground")}>
                      {t} records
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                      {t === "sales"
                        ? "product_name, quantity, revenue, date"
                        : "product_name, category, unit, quantity, expiry_date"}
                    </p>
                  </button>
                ))}
              </div>
              <button onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit mt-1">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Download {importType} template (.csv)
              </button>
            </div>

            {/* Step 2 — upload */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2 — Upload your file</p>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer py-8 transition-colors",
                  parsedRows.length > 0
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}>
                {parsedRows.length > 0 ? (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <FileSpreadsheet className="h-8 w-8 text-primary mb-1" />
                    <p className="text-sm font-semibold text-foreground">{fileName}</p>
                    <p className="text-xs text-primary">{parsedRows.length} rows ready to import</p>
                    <button onClick={(e) => { e.stopPropagation(); reset() }}
                      className="text-xs text-muted-foreground hover:text-foreground mt-1 underline">
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-1" />
                    <p className="text-sm font-medium text-foreground">Drop your file here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports .csv, .xlsx, .xls</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              </div>
              {parseError && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{parseError}</p>
              )}
            </div>

            {/* Step 3 — preview */}
            {preview.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step 3 — Preview (first {preview.length} rows)
                </p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-secondary">
                        <tr>
                          {Object.keys(preview[0]).map((k) => (
                            <th key={k} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap border-b border-border">
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-b border-border/50 last:border-0">
                            {Object.values(row).map((v: any, j) => (
                              <td key={j} className="px-3 py-2 text-foreground whitespace-nowrap">{String(v)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Looks correct? Click Import to process all {parsedRows.length} rows.
                </p>
              </div>
            )}

            {importError && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{importError}</p>
            )}
          </div>
        )}

        {!result && (
          <DialogFooter>
            <Button variant="outline" onClick={() => { onClose(); reset() }}>Cancel</Button>
            <Button onClick={handleImport} disabled={importing || parsedRows.length === 0}>
              {importing
                ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />Importing {parsedRows.length} rows...</>
                : <><Upload className="h-3.5 w-3.5 mr-1.5" />Import {parsedRows.length > 0 ? `${parsedRows.length} rows` : ""}</>
              }
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Inline Edit Row ──────────────────────────────────────────────
function EditableRow({ item, onSave, onDelete, onCancel }: {
  item: InventoryItem
  onSave: (productId: number, updates: any) => Promise<void>
  onDelete: (item: InventoryItem) => void
  onCancel: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: item.name, category: item.category, unit: item.unit,
    unit_cost: item.unit_cost.toString(),
    shelf_life_days: item.shelf_life_days?.toString() || "",
    reorder_threshold: item.reorder_threshold.toString(),
  })
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await onSave(item.product_id, {
        name: form.name.trim(), category: form.category, unit: form.unit,
        unit_cost: parseFloat(form.unit_cost) || 0,
        shelf_life_days: form.shelf_life_days ? parseInt(form.shelf_life_days) : null,
        reorder_threshold: parseInt(form.reorder_threshold) || 10,
      })
      onCancel()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-start py-3 border-b border-primary/30 bg-primary/5 -mx-2 px-2 rounded-lg">
      <div className="col-span-2 flex flex-col gap-1.5">
        <Input value={form.name} onChange={(e) => set("name", e.target.value)}
          className="h-8 text-sm" placeholder="Product name" />
        <select value={form.category} onChange={(e) => set("category", e.target.value)}
          className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="hidden md:block">
        <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
          className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
          {UNITS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>
      <p className="hidden md:flex items-center text-sm text-muted-foreground col-span-1 pt-1">
        {item.quantity}
      </p>
      <div className="hidden md:block">
        <Input value={form.unit_cost} onChange={(e) => set("unit_cost", e.target.value)}
          className="h-8 text-xs" placeholder="Cost" type="number" />
      </div>
      <div className="hidden md:block">
        <Input value={form.shelf_life_days} onChange={(e) => set("shelf_life_days", e.target.value)}
          className="h-8 text-xs" placeholder="Days" type="number" />
      </div>
      <div className="hidden md:block">
        <Input value={form.reorder_threshold} onChange={(e) => set("reorder_threshold", e.target.value)}
          className="h-8 text-xs" placeholder="Min" type="number" />
      </div>
      <div className="hidden md:block pt-1">
        {/* status — read only */}
      </div>
      <div className="flex items-center justify-end gap-1 pt-1">
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/70 hover:text-destructive"
          onClick={() => onDelete(item)} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onCancel} title="Cancel">
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" className="h-7 w-7" onClick={handleSave} disabled={saving} title="Save">
          {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  )
}

// ── Square Connect Dialog ────────────────────────────────────────
function SquareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState("")
  const [step, setStep] = useState<"form" | "done">("form")

  const handleConnect = () => {
    if (!apiKey.trim()) return
    setStep("done")
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setStep("form"); setApiKey("") } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white text-xs font-bold">S</div>
            Connect Square POS
          </DialogTitle>
          <DialogDescription>Sync your Square sales directly into EcoTrack.</DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              EcoTrack reads your Square sales history to power demand forecasting. No payment data is stored.
            </div>
            <div className="flex flex-col gap-2">
              <Label>Square Access Token</Label>
              <Input placeholder="EAAAl..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Find this in <span className="font-medium text-foreground">Square Developer → Applications → Credentials</span>
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">What gets synced:</p>
              <p>✓ Sales transactions (product, quantity, revenue, date)</p>
              <p>✓ Item catalog (product names and categories)</p>
              <p>✗ Customer data or payment details</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleConnect} disabled={!apiKey.trim()}>Connect Square</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Square connected!</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Full automatic sync is coming soon. For now, export your sales from Square as CSV and import them here.
              </p>
            </div>
            <div className="rounded-lg border border-border p-3 text-xs text-left w-full">
              <p className="font-semibold text-foreground mb-2">How to export from Square:</p>
              <p className="text-muted-foreground">1. Square Dashboard → Reports → Sales Summary</p>
              <p className="text-muted-foreground">2. Set your date range → Export CSV</p>
              <p className="text-muted-foreground">3. Come back → Import File → Sales records</p>
            </div>
            <Button onClick={onClose}>Got it</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Delete Confirm ───────────────────────────────────────────────
function DeleteDialog({ item, onClose, onConfirm }: {
  item: InventoryItem | null; onClose: () => void; onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>
            Permanently delete <span className="font-semibold text-foreground">{item?.name}</span> and all its inventory records. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" disabled={deleting} onClick={async () => {
            setDeleting(true); await onConfirm(); setDeleting(false); onClose()
          }}>
            {deleting ? "Deleting..." : "Yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ────────────────────────────────────────────────────
export default function InventoryPage() {
  const {
    items, importLogs, loading, error, refetch,
    addProduct, updateProduct, deleteProduct, importData,
  } = useInventory()

  const [search, setSearch]                 = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter]     = useState("All")
  const [sortBy, setSortBy]                 = useState<"name" | "quantity" | "expires" | "value">("name")
  const [sortDir, setSortDir]               = useState<"asc" | "desc">("asc")
  const [editingId, setEditingId]           = useState<number | null>(null)
  const [deleteItem, setDeleteItem]         = useState<InventoryItem | null>(null)
  const [showAdd, setShowAdd]               = useState(false)
  const [showImport, setShowImport]         = useState(false)
  const [showSquare, setShowSquare]         = useState(false)

  const categories = useMemo(() =>
    ["All", ...[...new Set(items.map((i) => i.category))].sort()], [items])

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => d === "asc" ? "desc" : "asc")
    else { setSortBy(col); setSortDir("asc") }
  }

  const filtered = useMemo(() => items
    .filter((item) => {
      const q = search.toLowerCase()
      return (!q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
        && (categoryFilter === "All" || item.category === categoryFilter)
        && (statusFilter   === "All" || item.status   === statusFilter)
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === "name")     cmp = a.name.localeCompare(b.name)
      if (sortBy === "quantity") cmp = a.quantity - b.quantity
      if (sortBy === "expires")  cmp = (a.expires_in ?? 9999) - (b.expires_in ?? 9999)
      if (sortBy === "value")    cmp = a.total_value - b.total_value
      return sortDir === "asc" ? cmp : -cmp
    }), [items, search, categoryFilter, statusFilter, sortBy, sortDir])

  const stats = useMemo(() => ({
    total:      items.length,
    lowStock:   items.filter((i) => i.status === "low").length,
    expiring:   items.filter((i) => i.status === "expiring").length,
    totalValue: items.reduce((s, i) => s + i.total_value, 0),
  }), [items])

  if (loading) return (
    <div className="flex flex-col gap-6">
      <div className="h-7 w-32 rounded bg-secondary animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1,2,3,4].map((i) => <Card key={i}><CardContent className="p-4"><div className="h-12 rounded bg-secondary animate-pulse" /></CardContent></Card>)}
      </div>
      <Card><CardContent className="p-5"><div className="h-64 rounded bg-secondary animate-pulse" /></CardContent></Card>
    </div>
  )

  if (error) return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-base font-semibold">Failed to load inventory</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button size="sm" className="mt-4" onClick={refetch}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">Track and manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={refetch}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowSquare(true)}>
            <Link2 className="h-3.5 w-3.5" /> Connect Square
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowImport(true)}>
            <Upload className="h-3.5 w-3.5" /> Import File
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Items",  value: stats.total,                      icon: Package,       v: "default" },
          { label: "Low Stock",    value: stats.lowStock,                   icon: AlertTriangle, v: "warning" },
          { label: "Expiring",     value: stats.expiring,                   icon: Clock,         v: "danger"  },
          { label: "Total Value",  value: formatCurrency(stats.totalValue), icon: Package,       v: "default" },
        ].map(({ label, value, icon: Icon, v }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                v === "default" ? "bg-primary/10" : v === "warning" ? "bg-amber-500/10" : "bg-destructive/10"
              )}>
                <Icon className={cn("h-4 w-4",
                  v === "default" ? "text-primary" : v === "warning" ? "text-amber-500" : "text-destructive"
                )} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Products ({items.length})</TabsTrigger>
          <TabsTrigger value="imports" className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" /> Import History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-9 w-full sm:w-64 h-9 bg-secondary border-transparent"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
                        {categoryFilter === "All" ? "Category" : categoryFilter}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {categories.map((c) => (
                        <DropdownMenuItem key={c} onClick={() => setCategoryFilter(c)}>
                          {c} {categoryFilter === c && <Check className="ml-auto h-3.5 w-3.5" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-9 gap-1">
                        {statusFilter === "All" ? "Status" : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(["All", "good", "low", "expiring", "expired"] as const).map((s) => (
                        <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                          {s === "All" ? "All statuses" : statusConfig[s].label}
                          {statusFilter === s && <Check className="ml-auto h-3.5 w-3.5" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Column headers */}
              <div className="hidden md:grid grid-cols-9 gap-3 border-b border-border pb-3 mb-1">
                {[
                  { label: "Product",  col: "name",     span: 2 },
                  { label: "Unit",     col: null,       span: 1 },
                  { label: "In Stock", col: "quantity", span: 1 },
                  { label: "Cost/u",   col: "value",    span: 1 },
                  { label: "Expires",  col: "expires",  span: 1 },
                  { label: "Reorder",  col: null,       span: 1 },
                  { label: "Status",   col: null,       span: 1 },
                  { label: "",         col: null,       span: 1 },
                ].map(({ label, col, span }) => (
                  <div key={label} className={`col-span-${span}`}>
                    {col ? (
                      <button onClick={() => toggleSort(col as any)}
                        className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                        {label} <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {filtered.map((item) => {
                  if (editingId === item.product_id) {
                    return (
                      <EditableRow key={item.product_id} item={item}
                        onSave={updateProduct}
                        onDelete={(i) => { setEditingId(null); setDeleteItem(i) }}
                        onCancel={() => setEditingId(null)} />
                    )
                  }

                  const status = statusConfig[item.status]
                  return (
                    <div key={item.product_id}
                      className="grid grid-cols-1 md:grid-cols-9 gap-2 md:gap-3 items-center py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/40 -mx-2 px-2 rounded-lg transition-colors group">

                      <div className="col-span-2 flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.category} · {formatTime(item.updated_at)}</p>
                        </div>
                      </div>

                      <p className="hidden md:block text-xs text-muted-foreground">{item.unit}</p>

                      <p className="hidden md:block text-sm font-semibold text-foreground">{item.quantity}</p>

                      <p className="hidden md:block text-xs text-muted-foreground">
                        {formatCurrency(item.unit_cost)}
                      </p>

                      <p className={cn("hidden md:block text-xs font-medium",
                        item.expires_in !== null && item.expires_in <= 0  ? "text-destructive" :
                        item.expires_in !== null && item.expires_in <= 3  ? "text-amber-500"   : "text-muted-foreground"
                      )}>
                        {item.expires_in === null ? "—" :
                         item.expires_in <= 0  ? "Expired" :
                         item.expires_in === 1 ? "Tomorrow" : `${item.expires_in}d`}
                      </p>

                      <p className="hidden md:block text-xs text-muted-foreground">
                        ≤ {item.reorder_threshold}
                      </p>

                      <div className="hidden md:flex">
                        <Badge variant="outline" className={cn("text-[10px] border", status.color)}>
                          {status.label}
                        </Badge>
                      </div>

                      <div className="hidden md:flex justify-end">
                        <Button variant="ghost" size="icon"
                          className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
                          onClick={() => setEditingId(item.product_id)} title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Mobile */}
                      <div className="flex items-center justify-between md:hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.quantity} {item.unit}</span>
                          <Badge variant="outline" className={cn("text-[10px] border", status.color)}>{status.label}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7"
                          onClick={() => setEditingId(item.product_id)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      {items.length === 0 ? "No products yet" : "No products match your filters"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {items.length === 0
                        ? "Add your first product manually or import from a file."
                        : "Try adjusting your search or filters."}
                    </p>
                    {items.length === 0 && (
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" onClick={() => setShowAdd(true)}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowImport(true)}>
                          <Upload className="h-3.5 w-3.5 mr-1" /> Import File
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imports">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Import History</CardTitle>
              <CardDescription>Log of all file imports and sync operations</CardDescription>
            </CardHeader>
            <CardContent>
              {importLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">No imports yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Import a CSV or Excel file to see logs here.</p>
                </div>
              ) : importLogs.map((log) => (
                <div key={log.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 mb-2 last:mb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {log.import_type} import · <span className="text-muted-foreground font-normal">{log.source}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.rows_imported} imported
                        {log.rows_failed > 0 && `, ${log.rows_failed} failed`}
                        {" · "}{formatTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"}
                    className="text-[10px] capitalize shrink-0">
                    {log.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} onSave={addProduct} />
      <ImportDialog open={showImport} onClose={() => setShowImport(false)} onImport={importData} />
      <SquareDialog open={showSquare} onClose={() => setShowSquare(false)} />
      <DeleteDialog item={deleteItem} onClose={() => setDeleteItem(null)}
        onConfirm={async () => { if (deleteItem) await deleteProduct(deleteItem.product_id) }} />
    </div>
  )
}