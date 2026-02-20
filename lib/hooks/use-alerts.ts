'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export type AlertStatus = 'active' | 'snoozed' | 'resolved'
export type AlertType = 'expiry' | 'surplus' | 'low-stock' | 'recommendation'
export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type Alert = {
  id: number
  business_id: number
  product_id: number
  alert_type: AlertType
  message: string
  detail: string
  severity: Severity
  is_dismissed: boolean
  status: AlertStatus
  snoozed_until?: string | null
  resolved_note?: string | null
  resolved_at?: string | null
  created_at: string
  // joined from products table
  product?: { name: string }
}

export type HistoryEntry = {
  id: number
  alert_id: number | null
  user_id: string
  product: string
  message: string
  action: 'resolved' | 'snoozed' | 'dismissed'
  note?: string | null
  created_at: string
}

export function useAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the business_id for the current user
  const getBusinessId = useCallback(async (): Promise<number | null> => {
    if (!user) return null
    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (error || !data) return null
    return data.id
  }, [user])

  const fetchAlerts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const businessId = await getBusinessId()
      if (!businessId) {
        // No business linked yet — show empty state, not an error
        setAlerts([])
        return
      }

      const { data, error } = await supabase
        .from('alerts')
        .select('*, product:products(name)')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, getBusinessId])

  const fetchHistory = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('alert_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setHistory(data || [])
    } catch (err: any) {
      console.error('Failed to fetch alert history:', err.message)
    }
  }, [user])

  useEffect(() => {
    fetchAlerts()
    fetchHistory()
  }, [fetchAlerts, fetchHistory])

  const logHistory = async (alert: Alert, action: HistoryEntry['action'], note?: string) => {
    if (!user) return
    const productName = alert.product?.name || `Product #${alert.product_id}`
    await supabase.from('alert_history').insert({
      alert_id: alert.id,
      user_id: user.id,
      product: productName,
      message: alert.message,
      action,
      note: note || null,
    })
    fetchHistory()
  }

  const resolveAlert = async (alert: Alert, note?: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({
        status: 'resolved',
        is_dismissed: true,
        resolved_note: note || null,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', alert.id)

    if (!error) {
      setAlerts((prev) => prev.map((a) => a.id === alert.id
        ? { ...a, status: 'resolved', is_dismissed: true, resolved_note: note, resolved_at: new Date().toISOString() }
        : a
      ))
      await logHistory(alert, 'resolved', note)
    }
  }

  const snoozeAlert = async (alert: Alert, hours: number) => {
    const until = new Date(Date.now() + hours * 3600000).toISOString()
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'snoozed', snoozed_until: until })
      .eq('id', alert.id)

    if (!error) {
      setAlerts((prev) => prev.map((a) => a.id === alert.id
        ? { ...a, status: 'snoozed', snoozed_until: until }
        : a
      ))
      await logHistory(alert, 'snoozed', `Snoozed for ${hours}hr${hours > 1 ? 's' : ''}`)
    }
  }

  const dismissAlert = async (alert: Alert) => {
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'resolved', is_dismissed: true, resolved_at: new Date().toISOString() })
      .eq('id', alert.id)

    if (!error) {
      setAlerts((prev) => prev.map((a) => a.id === alert.id
        ? { ...a, status: 'resolved', is_dismissed: true, resolved_at: new Date().toISOString() }
        : a
      ))
      await logHistory(alert, 'dismissed')
    }
  }

  const dismissAll = async () => {
    const active = alerts.filter((a) => a.status === 'active')
    if (!active.length) return

    const { error } = await supabase
      .from('alerts')
      .update({ status: 'resolved', is_dismissed: true, resolved_at: new Date().toISOString() })
      .in('id', active.map((a) => a.id))

    if (!error) {
      setAlerts((prev) => prev.map((a) => a.status === 'active'
        ? { ...a, status: 'resolved', is_dismissed: true, resolved_at: new Date().toISOString() }
        : a
      ))
      for (const alert of active) {
        await logHistory(alert, 'dismissed')
      }
    }
  }

  const reactivateAlert = async (id: number) => {
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'active', is_dismissed: false, resolved_note: null, snoozed_until: null, resolved_at: null })
      .eq('id', id)

    if (!error) {
      setAlerts((prev) => prev.map((a) => a.id === id
        ? { ...a, status: 'active', is_dismissed: false, resolved_note: null, snoozed_until: null, resolved_at: null }
        : a
      ))
    }
  }

  return {
    alerts,
    history,
    loading,
    error,
    refetch: fetchAlerts,
    resolveAlert,
    snoozeAlert,
    dismissAlert,
    dismissAll,
    reactivateAlert,
  }
}