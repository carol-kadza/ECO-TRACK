import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST — add product + initial inventory
export async function POST(req: NextRequest) {
  try {
    const { businessId, product, inventory } = await req.json()

    // Insert product
    const { data: newProduct, error: prodErr } = await supabase
      .from('products')
      .insert({
        business_id: businessId,
        name: product.name,
        category: product.category,
        unit: product.unit,
        unit_cost: product.unit_cost,
        shelf_life_days: product.shelf_life_days,
        reorder_threshold: product.reorder_threshold,
      })
      .select()
      .single()

    if (prodErr) throw prodErr

    // Insert inventory if provided
    if (inventory?.quantity > 0) {
      const { error: invErr } = await supabase
        .from('inventory')
        .insert({
          product_id: newProduct.id,
          quantity: inventory.quantity,
          expiry_date: inventory.expiry_date || null,
          batch_number: inventory.batch_number || null,
        })
      if (invErr) throw invErr
    }

    return NextResponse.json({ success: true, product: newProduct })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT — update product
export async function PUT(req: NextRequest) {
  try {
    const { productId, updates } = await req.json()

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — delete product (cascades to inventory)
export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}