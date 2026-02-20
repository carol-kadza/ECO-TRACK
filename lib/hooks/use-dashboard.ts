'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export type StatData = {
  activeProducts: number
  activeAlerts: number
  criticalAlerts: number
  totalRevenue: number
  totalRevenueLastMonth: number
  wasteUnits: number       // expired inventory units this month
  wasteUnitsLastMonth: number
}

export type WasteChartPoint = {
  date: string
  waste: number
  target: number
}

export type DemandChartPoint = {
  day: string
  actual: number
  predicted: number
}

export type RecentAlert = {
  id: number
  product: string
  message: string
  severity: string
  alert_type: string
  created_at: string
}

export type TopWasteItem = {
  name: string
  waste: number
  total: number
  percentage: number
}

export type DashboardData = {
  stats: StatData
  wasteChart: WasteChartPoint[]
  demandChart: DemandChartPoint[]
  recentAlerts: RecentAlert[]
  topWasteItems: TopWasteItem[]
}

function formatChartDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function useDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      // 1. Get business for this user
      const { data: business, error: bizErr } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (bizErr || !business) {
        // No business yet — return empty state
        setData({
          stats: { activeProducts: 0, activeAlerts: 0, criticalAlerts: 0, totalRevenue: 0, totalRevenueLastMonth: 0, wasteUnits: 0, wasteUnitsLastMonth: 0 },
          wasteChart: [],
          demandChart: [],
          recentAlerts: [],
          topWasteItems: [],
        })
        return
      }

      const businessId = business.id
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      const today = now.toISOString().split('T')[0]

      // Run all queries in parallel
      const [
        productsRes,
        alertsRes,
        recentAlertsRes,
        salesThisMonthRes,
        salesLastMonthRes,
        salesWeekRes,
        inventoryExpiredRes,
        inventoryExpiredLastMonthRes,
        inventoryAllRes,
        wasteTrendRes,
      ] = await Promise.all([
        // Active products count
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId),

        // Active alerts count + critical count
        supabase
          .from('alerts')
          .select('id, severity', { count: 'exact' })
          .eq('business_id', businessId)
          .eq('is_dismissed', false),

        // Recent alerts (last 4, joined with product name)
        supabase
          .from('alerts')
          .select('id, message, severity, alert_type, created_at, product:products(name)')
          .eq('business_id', businessId)
          .eq('is_dismissed', false)
          .order('created_at', { ascending: false })
          .limit(4),

        // Revenue this month
        supabase
          .from('sales')
          .select('revenue, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .gte('sale_date', startOfMonth)
          .lte('sale_date', today),

        // Revenue last month
        supabase
          .from('sales')
          .select('revenue, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .gte('sale_date', startOfLastMonth)
          .lte('sale_date', endOfLastMonth),

        // Sales this week (for demand chart)
        supabase
          .from('sales')
          .select('quantity_sold, sale_date, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .gte('sale_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0])
          .lte('sale_date', today),

        // Expired inventory this month (waste units)
        supabase
          .from('inventory')
          .select('quantity, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .lt('expiry_date', today)
          .gte('expiry_date', startOfMonth),

        // Expired inventory last month
        supabase
          .from('inventory')
          .select('quantity, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .lt('expiry_date', endOfLastMonth)
          .gte('expiry_date', startOfLastMonth),

        // All inventory for top waste items (expired, grouped by product)
        supabase
          .from('inventory')
          .select('quantity, expiry_date, product:products!inner(id, name, business_id)')
          .eq('product.business_id', businessId)
          .lt('expiry_date', today)
          .order('expiry_date', { ascending: false })
          .limit(100),

        // Inventory expiry data for waste trend (last 30 days)
        supabase
          .from('inventory')
          .select('quantity, expiry_date, product:products!inner(business_id)')
          .eq('product.business_id', businessId)
          .gte('expiry_date', thirtyDaysAgo)
          .lte('expiry_date', today)
          .order('expiry_date', { ascending: true }),
      ])

      // --- Stats ---
      const activeProducts = productsRes.count ?? 0
      const activeAlerts = alertsRes.count ?? 0
      const criticalAlerts = (alertsRes.data ?? []).filter((a: any) => a.severity === 'critical').length

      const totalRevenue = (salesThisMonthRes.data ?? []).reduce((s: number, r: any) => s + (r.revenue || 0), 0)
      const totalRevenueLastMonth = (salesLastMonthRes.data ?? []).reduce((s: number, r: any) => s + (r.revenue || 0), 0)

      const wasteUnits = (inventoryExpiredRes.data ?? []).reduce((s: number, r: any) => s + (r.quantity || 0), 0)
      const wasteUnitsLastMonth = (inventoryExpiredLastMonthRes.data ?? []).reduce((s: number, r: any) => s + (r.quantity || 0), 0)

      // --- Recent alerts ---
      const recentAlerts: RecentAlert[] = (recentAlertsRes.data ?? []).map((a: any) => ({
        id: a.id,
        product: a.product?.name ?? 'Unknown product',
        message: a.message,
        severity: a.severity,
        alert_type: a.alert_type,
        created_at: a.created_at,
      }))

      // --- Top waste items (group expired inventory by product) ---
      const wasteByProduct: Record<string, { name: string; waste: number }> = {}
      for (const row of (inventoryAllRes.data ?? [])) {
        const name = (row as any).product?.name ?? 'Unknown'
        if (!wasteByProduct[name]) wasteByProduct[name] = { name, waste: 0 }
        wasteByProduct[name].waste += (row as any).quantity || 0
      }
      const totalWaste = Object.values(wasteByProduct).reduce((s, v) => s + v.waste, 0)
      const topWasteItems: TopWasteItem[] = Object.values(wasteByProduct)
        .sort((a, b) => b.waste - a.waste)
        .slice(0, 5)
        .map((item) => ({
          name: item.name,
          waste: item.waste,
          total: totalWaste,
          percentage: totalWaste > 0 ? Math.round((item.waste / totalWaste) * 100) : 0,
        }))

      // --- Waste trend chart (last 30 days, group by date) ---
      const wasteByDate: Record<string, number> = {}
      for (const row of (wasteTrendRes.data ?? [])) {
        const date = (row as any).expiry_date
        if (!wasteByDate[date]) wasteByDate[date] = 0
        wasteByDate[date] += (row as any).quantity || 0
      }
      // Fill all 30 days even if no data
      const avgWaste = wasteUnits > 0 ? Math.round(wasteUnits / 30) : 0
      const target = avgWaste > 0 ? Math.round(avgWaste * 0.7) : 10 // 30% reduction target
      const wasteChart: WasteChartPoint[] = []
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000)
        const key = d.toISOString().split('T')[0]
        wasteChart.push({
          date: formatChartDate(key),
          waste: wasteByDate[key] ?? 0,
          target,
        })
      }

      // --- Demand chart (actual sales grouped by day of week this week) ---
      const salesByDay: Record<string, number> = {}
      for (const row of (salesWeekRes.data ?? [])) {
        const dayName = DAYS[new Date((row as any).sale_date).getDay()]
        if (!salesByDay[dayName]) salesByDay[dayName] = 0
        salesByDay[dayName] += (row as any).quantity_sold || 0
      }
      // Simple predicted = actual * 1.1 (10% over actual as a naive forecast)
      // Days with no actual data yet get predicted only
      const demandChart: DemandChartPoint[] = DAYS.slice(1).concat(DAYS[0]).map((day) => {
        const actual = salesByDay[day] ?? 0
        const predicted = actual > 0 ? Math.round(actual * 1.1) : 0
        return { day, actual, predicted }
      })

      setData({
        stats: { activeProducts, activeAlerts, criticalAlerts, totalRevenue, totalRevenueLastMonth, wasteUnits, wasteUnitsLastMonth },
        wasteChart,
        demandChart,
        recentAlerts,
        topWasteItems,
      })
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData, lastUpdated }
}