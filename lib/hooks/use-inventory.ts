// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useAuth } from '@/lib/auth-context'

// export type InventoryItem = {
//   id: number           // inventory id
//   product_id: number
//   name: string
//   category: string
//   unit: string
//   unit_cost: number
//   shelf_life_days: number | null
//   reorder_threshold: number
//   quantity: number
//   expiry_date: string | null
//   batch_number: string | null
//   status: 'good' | 'low' | 'expiring' | 'expired'
//   expires_in: number | null  // days until expiry
//   total_value: number
//   updated_at: string | null
// }

// export type ImportLog = {
//   id: number
//   import_type: string
//   source: string
//   rows_imported: number
//   rows_failed: number
//   status: string
//   created_at: string
// }

// function getStatus(item: { quantity: number; reorder_threshold: number; expires_in: number | null }): InventoryItem['status'] {
//   if (item.expires_in !== null && item.expires_in < 0) return 'expired'
//   if (item.expires_in !== null && item.expires_in <= 3) return 'expiring'
//   if (item.quantity <= item.reorder_threshold) return 'low'
//   return 'good'
// }

// export function useInventory() {
//   const { user } = useAuth()
//   const [items, setItems] = useState<InventoryItem[]>([])
//   const [importLogs, setImportLogs] = useState<ImportLog[]>([])
//   const [businessId, setBusinessId] = useState<number | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const getBusinessId = useCallback(async (): Promise<number | null> => {
//     if (!user) return null
//     const { data } = await supabase
//       .from('businesses')
//       .select('id')
//       .eq('user_id', user.id)
//       .single()
//     return data?.id ?? null
//   }, [user])

//   const fetchInventory = useCallback(async () => {
//     if (!user) return
//     setLoading(true)
//     setError(null)
//     try {
//       const bizId = await getBusinessId()
//       if (!bizId) { setItems([]); setLoading(false); return }
//       setBusinessId(bizId)

//       const today = new Date().toISOString().split('T')[0]

//       // Fetch products + latest inventory per product
//       const { data: products, error: prodErr } = await supabase
//         .from('products')
//         .select(`
//           id, name, category, unit, unit_cost, shelf_life_days, reorder_threshold,
//           inventory(id, quantity, expiry_date, batch_number, updated_at)
//         `)
//         .eq('business_id', bizId)
//         .order('name', { ascending: true })

//       if (prodErr) throw prodErr

//       const mapped: InventoryItem[] = []

//       for (const product of products || []) {
//         const invRows = (product.inventory as any[]) || []

//         if (invRows.length === 0) {
//           // Product with no inventory entries
//           mapped.push({
//             id: 0,
//             product_id: product.id,
//             name: product.name,
//             category: product.category || 'Uncategorized',
//             unit: product.unit || 'units',
//             unit_cost: product.unit_cost || 0,
//             shelf_life_days: product.shelf_life_days,
//             reorder_threshold: product.reorder_threshold || 10,
//             quantity: 0,
//             expiry_date: null,
//             batch_number: null,
//             status: 'low',
//             expires_in: null,
//             total_value: 0,
//             updated_at: null,
//           })
//           continue
//         }

//         // Aggregate all non-expired inventory for this product
//         const validRows = invRows.filter((r) => !r.expiry_date || r.expiry_date >= today)
//         const totalQty = validRows.reduce((s: number, r: any) => s + (r.quantity || 0), 0)

//         // Use the soonest expiry
//         const soonest = validRows
//           .filter((r: any) => r.expiry_date)
//           .sort((a: any, b: any) => a.expiry_date.localeCompare(b.expiry_date))[0]

//         const expiresIn = soonest
//           ? Math.floor((new Date(soonest.expiry_date).getTime() - new Date(today).getTime()) / 86400000)
//           : null

//         const latest = invRows.sort((a: any, b: any) =>
//           new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
//         )[0]

//         const reorderThreshold = product.reorder_threshold || 10

//         mapped.push({
//           id: latest.id,
//           product_id: product.id,
//           name: product.name,
//           category: product.category || 'Uncategorized',
//           unit: product.unit || 'units',
//           unit_cost: product.unit_cost || 0,
//           shelf_life_days: product.shelf_life_days,
//           reorder_threshold,
//           quantity: totalQty,
//           expiry_date: soonest?.expiry_date || null,
//           batch_number: latest.batch_number,
//           status: getStatus({ quantity: totalQty, reorder_threshold: reorderThreshold, expires_in: expiresIn }),
//           expires_in: expiresIn,
//           total_value: totalQty * (product.unit_cost || 0),
//           updated_at: latest.updated_at,
//         })
//       }

//       setItems(mapped)

//       // Fetch import logs
//       const { data: logs } = await supabase
//         .from('import_logs')
//         .select('*')
//         .eq('business_id', bizId)
//         .order('created_at', { ascending: false })
//         .limit(10)
//       setImportLogs(logs || [])

//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }, [user, getBusinessId])

//   useEffect(() => {
//     fetchInventory()
//   }, [fetchInventory])

//   const addProduct = async (product: any, inventory: any) => {
//     const res = await fetch('/api/inventory', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ businessId, product, inventory }),
//     })
//     const json = await res.json()
//     if (!res.ok) throw new Error(json.error)
//     await fetchInventory()
//     return json
//   }

//   const updateProduct = async (productId: number, updates: any) => {
//     const res = await fetch('/api/inventory', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ productId, updates }),
//     })
//     const json = await res.json()
//     if (!res.ok) throw new Error(json.error)
//     await fetchInventory()
//   }

//   const deleteProduct = async (productId: number) => {
//     const res = await fetch('/api/inventory', {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ productId }),
//     })
//     const json = await res.json()
//     if (!res.ok) throw new Error(json.error)
//     await fetchInventory()
//   }

//   const importData = async (importType: 'sales' | 'inventory', source: string, rows: any[]) => {
//     const res = await fetch('/api/import', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ businessId, importType, source, rows }),
//     })
//     const json = await res.json()
//     if (!res.ok) throw new Error(json.error)
//     await fetchInventory()
//     return json
//   }

//   return {
//     items, importLogs, businessId, loading, error,
//     refetch: fetchInventory,
//     addProduct, updateProduct, deleteProduct, importData,
//   }
// }



'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export type InventoryItem = {
  id: number
  product_id: number
  name: string
  category: string
  unit: string
  unit_cost: number
  shelf_life_days: number | null
  reorder_threshold: number
  quantity: number
  expiry_date: string | null
  batch_number: string | null
  status: 'good' | 'low' | 'expiring' | 'expired'
  expires_in: number | null
  total_value: number
  updated_at: string | null
}

export type ImportLog = {
  id: number
  import_type: string
  source: string
  rows_imported: number
  rows_failed: number
  status: string
  created_at: string
}

function getStatus(qty: number, threshold: number, expiresIn: number | null): InventoryItem['status'] {
  if (expiresIn !== null && expiresIn < 0) return 'expired'
  if (expiresIn !== null && expiresIn <= 3) return 'expiring'
  if (qty <= threshold) return 'low'
  return 'good'
}

export function useInventory() {
  const { user } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [importLogs, setImportLogs] = useState<ImportLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use a ref so API calls always get the latest businessId without stale closures
  const businessIdRef = useRef<number | null>(null)

  const getOrFetchBusinessId = useCallback(async (): Promise<number | null> => {
    if (businessIdRef.current) return businessIdRef.current
    if (!user) return null
    const { data } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (data?.id) businessIdRef.current = data.id
    return data?.id ?? null
  }, [user])

  const fetchInventory = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const bizId = await getOrFetchBusinessId()
      if (!bizId) { setItems([]); setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]

      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select(`
          id, name, category, unit, unit_cost, shelf_life_days, reorder_threshold,
          inventory(id, quantity, expiry_date, batch_number, updated_at)
        `)
        .eq('business_id', bizId)
        .order('name', { ascending: true })

      if (prodErr) throw prodErr

      const mapped: InventoryItem[] = (products || []).map((product) => {
        const invRows: any[] = (product.inventory as any[]) || []

        if (invRows.length === 0) {
          return {
            id: 0, product_id: product.id, name: product.name,
            category: product.category || 'Uncategorized',
            unit: product.unit || 'units', unit_cost: product.unit_cost || 0,
            shelf_life_days: product.shelf_life_days,
            reorder_threshold: product.reorder_threshold || 10,
            quantity: 0, expiry_date: null, batch_number: null,
            status: 'low', expires_in: null, total_value: 0, updated_at: null,
          }
        }

        const validRows = invRows.filter((r) => !r.expiry_date || r.expiry_date >= today)
        const totalQty = validRows.reduce((s: number, r: any) => s + (r.quantity || 0), 0)
        const soonest = validRows
          .filter((r: any) => r.expiry_date)
          .sort((a: any, b: any) => a.expiry_date.localeCompare(b.expiry_date))[0]

        const expiresIn = soonest
          ? Math.floor((new Date(soonest.expiry_date).getTime() - new Date(today).getTime()) / 86400000)
          : null

        const latest = [...invRows].sort((a: any, b: any) =>
          new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
        )[0]

        const threshold = product.reorder_threshold || 10

        return {
          id: latest.id, product_id: product.id, name: product.name,
          category: product.category || 'Uncategorized',
          unit: product.unit || 'units', unit_cost: product.unit_cost || 0,
          shelf_life_days: product.shelf_life_days, reorder_threshold: threshold,
          quantity: totalQty, expiry_date: soonest?.expiry_date || null,
          batch_number: latest.batch_number,
          status: getStatus(totalQty, threshold, expiresIn),
          expires_in: expiresIn,
          total_value: totalQty * (product.unit_cost || 0),
          updated_at: latest.updated_at,
        }
      })

      setItems(mapped)

      // Fetch import logs
      const { data: logs } = await supabase
        .from('import_logs')
        .select('*')
        .eq('business_id', bizId)
        .order('created_at', { ascending: false })
        .limit(20)
      setImportLogs(logs || [])

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, getOrFetchBusinessId])

  useEffect(() => { fetchInventory() }, [fetchInventory])

  const addProduct = async (product: any, inventory: any) => {
    // Always get the freshest businessId — never rely on potentially-null state
    const bizId = await getOrFetchBusinessId()
    if (!bizId) throw new Error('No business found. Please complete onboarding first.')

    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: bizId, product, inventory }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to add product')
    await fetchInventory()
    return json
  }

  const updateProduct = async (productId: number, updates: any) => {
    const res = await fetch('/api/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, updates }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to update product')
    await fetchInventory()
  }

  const deleteProduct = async (productId: number) => {
    const res = await fetch('/api/inventory', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to delete product')
    await fetchInventory()
  }

  const importData = async (importType: 'sales' | 'inventory', source: string, rows: any[]) => {
    const bizId = await getOrFetchBusinessId()
    if (!bizId) throw new Error('No business found. Please complete onboarding first.')

    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: bizId, importType, source, rows }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Import failed')
    await fetchInventory()
    return json
  }

  return {
    items, importLogs, loading, error,
    refetch: fetchInventory,
    addProduct, updateProduct, deleteProduct, importData,
  }
}