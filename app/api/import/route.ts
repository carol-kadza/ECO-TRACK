import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This route MUST use the service role key to bypass RLS
// Add SUPABASE_SERVICE_ROLE_KEY to your .env.local
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function findProduct(businessId: number, name: string) {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('business_id', businessId)
    .ilike('name', name.trim())
    .maybeSingle()
  return data
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, importType, source, rows } = body

    if (!businessId) return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
    if (!importType) return NextResponse.json({ error: 'importType is required' }, { status: 400 })
    if (!rows?.length) return NextResponse.json({ error: 'No rows to import' }, { status: 400 })

    let imported = 0
    let failed = 0
    const errors: string[] = []

    if (importType === 'sales') {
      for (const row of rows) {
        try {
          const productName = String(row.product_name || row.name || row.product || '').trim()
          if (!productName) { failed++; errors.push('Row missing product_name'); continue }

          const product = await findProduct(businessId, productName)
          if (!product) {
            failed++
            errors.push(`Product not found: "${productName}" — add it to inventory first`)
            continue
          }

          const saleDate = row.date || row.sale_date || row.Date || new Date().toISOString().split('T')[0]
          const qty      = Number(row.quantity || row.qty || row.quantity_sold || row.Quantity || 0)
          const revenue  = Number(row.revenue || row.amount || row.total || row.Revenue || 0)

          const { error } = await supabaseAdmin.from('sales').insert({
            product_id: product.id,
            quantity_sold: qty,
            revenue,
            sale_date: saleDate,
          })
          if (error) throw error
          imported++
        } catch (e: any) {
          failed++
          errors.push(e.message?.slice(0, 100))
        }
      }
    }

    if (importType === 'inventory') {
      for (const row of rows) {
        try {
          const productName = String(row.product_name || row.name || row.product || row.Name || '').trim()
          if (!productName) { failed++; errors.push('Row missing product_name'); continue }

          let product = await findProduct(businessId, productName)

          if (!product) {
            const { data: newProd, error: createErr } = await supabaseAdmin
              .from('products')
              .insert({
                business_id: businessId,
                name: productName,
                category: String(row.category || row.Category || 'Uncategorized'),
                unit: String(row.unit || row.Unit || 'units'),
                unit_cost: Number(row.unit_cost || row.cost || row.Cost || 0),
                shelf_life_days: Number(row.shelf_life_days) || null,
                reorder_threshold: Number(row.reorder_threshold) || 10,
              })
              .select('id')
              .single()
            if (createErr) throw createErr
            product = newProd
          }

          if (!product) { failed++; continue }

          const qty        = Number(row.quantity || row.qty || row.Quantity || 0)
          const expiryDate = String(row.expiry_date || row.expiry || row.Expiry || row['expiry date'] || '').trim() || null
          const batchNo    = String(row.batch_number || row.batch || row.Batch || '').trim() || null

          const { error } = await supabaseAdmin.from('inventory').insert({
            product_id: product.id,
            quantity: qty,
            expiry_date: expiryDate,
            batch_number: batchNo,
          })
          if (error) throw error
          imported++
        } catch (e: any) {
          failed++
          errors.push(e.message?.slice(0, 100))
        }
      }
    }

    // Log — try/catch so a log failure doesn't break the response
    try {
      await supabaseAdmin.from('import_logs').insert({
        business_id: businessId,
        import_type: importType,
        source,
        rows_imported: imported,
        rows_failed: failed,
        status: imported === 0 ? 'failed' : failed > 0 ? 'partial' : 'success',
        notes: errors.slice(0, 5).join('; ') || null,
      })
    } catch (_) {}

    return NextResponse.json({ success: true, imported, failed, errors: errors.slice(0, 5) })
  } catch (err: any) {
    console.error('[import] error:', err)
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 500 })
  }
}