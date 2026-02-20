'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export type Forecast = {
  id: number
  product_id: number
  forecast_date: string
  predicted_qty: number
  lower_bound: number
  upper_bound: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  change_pct: number
  generated_at: string
  product?: { name: string; category: string }
}

export type WeeklyPoint = {
  day: string
  predicted: number
  lower: number
  upper: number
}

export type CategoryPoint = {
  category: string
  demand: number
}

export function useForecasting() {
  const { user } = useAuth()
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [businessId, setBusinessId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  const getBusinessId = useCallback(async (): Promise<number | null> => {
    if (!user) return null
    const { data } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()
    return data?.id ?? null
  }, [user])

  const fetchForecasts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const bizId = await getBusinessId()
      if (!bizId) { setForecasts([]); return }
      setBusinessId(bizId)

      const today = new Date().toISOString().split('T')[0]
      const sevenDaysOut = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('forecasts')
        .select('*, product:products(name, category)')
        .eq('business_id', bizId)
        .gte('forecast_date', today)
        .lte('forecast_date', sevenDaysOut)
        .order('forecast_date', { ascending: true })

      if (error) throw error
      setForecasts(data || [])

      // Get last generated time
      if (data?.length) {
        const latest = data.reduce((a, b) =>
          new Date(a.generated_at) > new Date(b.generated_at) ? a : b
        )
        setLastGenerated(latest.generated_at)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, getBusinessId])

  useEffect(() => {
    fetchForecasts()
  }, [fetchForecasts])

  const generateForecasts = async () => {
    if (!businessId) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/forecasting/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Generation failed')
      await fetchForecasts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  // Derived data for charts
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const weeklyChart: WeeklyPoint[] = DAYS.map((day, i) => {
    const date = new Date(Date.now() + (i + 1) * 86400000)
    const dayForecasts = forecasts.filter(
      (f) => f.forecast_date === date.toISOString().split('T')[0]
    )
    const predicted = dayForecasts.reduce((s, f) => s + f.predicted_qty, 0)
    const lower = dayForecasts.reduce((s, f) => s + (f.lower_bound || 0), 0)
    const upper = dayForecasts.reduce((s, f) => s + (f.upper_bound || 0), 0)
    return { day, predicted, lower, upper }
  })

  const categoryChart: CategoryPoint[] = Object.values(
    forecasts.reduce((acc: Record<string, CategoryPoint>, f) => {
      const cat = f.product?.category || 'Other'
      if (!acc[cat]) acc[cat] = { category: cat, demand: 0 }
      acc[cat].demand += f.predicted_qty
      return acc
    }, {})
  ).sort((a, b) => b.demand - a.demand)

  // Per-product summary (latest forecast per product)
  const productForecasts = Object.values(
    forecasts.reduce((acc: Record<number, Forecast>, f) => {
      if (!acc[f.product_id] || f.forecast_date > acc[f.product_id].forecast_date) {
        acc[f.product_id] = f
      }
      return acc
    }, {})
  )

  const totalPredicted = weeklyChart.reduce((s, d) => s + d.predicted, 0)
  const avgConfidence = forecasts.length
    ? Math.round(forecasts.reduce((s, f) => s + f.confidence, 0) / forecasts.length)
    : 0

  return {
    forecasts,
    weeklyChart,
    categoryChart,
    productForecasts,
    totalPredicted,
    avgConfidence,
    loading,
    generating,
    error,
    lastGenerated,
    generateForecasts,
    refetch: fetchForecasts,
  }
}