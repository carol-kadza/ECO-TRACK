import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json()
    if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 })

    // 1. Fetch products
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, category, unit_cost, shelf_life_days')
      .eq('business_id', businessId)

    if (prodErr || !products?.length) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 })
    }

    // 2. Fetch last 30 days of sales
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    const { data: sales } = await supabase
      .from('sales')
      .select('product_id, quantity_sold, sale_date')
      .in('product_id', products.map((p) => p.id))
      .gte('sale_date', thirtyDaysAgo)
      .lte('sale_date', today)
      .order('sale_date', { ascending: true })

    // 3. Fetch current inventory
    const { data: inventory } = await supabase
      .from('inventory')
      .select('product_id, quantity, expiry_date')
      .in('product_id', products.map((p) => p.id))
      .gte('expiry_date', today)

    // 4. Build context
    const salesByProduct: Record<number, { date: string; qty: number }[]> = {}
    for (const sale of sales || []) {
      if (!salesByProduct[sale.product_id]) salesByProduct[sale.product_id] = []
      salesByProduct[sale.product_id].push({ date: sale.sale_date, qty: sale.quantity_sold })
    }

    const inventoryByProduct: Record<number, number> = {}
    for (const inv of inventory || []) {
      inventoryByProduct[inv.product_id] = (inventoryByProduct[inv.product_id] || 0) + inv.quantity
    }

    const productContext = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      shelf_life_days: p.shelf_life_days,
      current_stock: inventoryByProduct[p.id] || 0,
      sales_history: salesByProduct[p.id] || [],
    }))

    // 5. Next 7 days
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() + (i + 1) * 86400000)
      return d.toISOString().split('T')[0]
    })

    // 6. Ask Claude
    const prompt = `You are a demand forecasting AI for a food business. Analyze the sales history and generate demand forecasts for the next 7 days for each product.

Products and sales data:
${JSON.stringify(productContext, null, 2)}

Forecast dates: ${nextSevenDays.join(', ')}

Instructions:
- Detect day-of-week patterns in sales history
- If no sales history, use 10 units/day as baseline
- confidence: 60-95 based on data availability
- trend: "up" if recent 7-day avg > prior 7-day avg, "down" if lower, "stable" if within 5%
- change_pct: % change vs previous period (positive = up)
- lower_bound = predicted * 0.85, upper_bound = predicted * 1.15

Return ONLY a valid JSON array, no markdown or explanation:
[{"product_id":1,"forecast_date":"2024-01-15","predicted_qty":45,"lower_bound":38,"upper_bound":52,"confidence":88,"trend":"up","change_pct":12.5}]`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = (response.content[0] as any).text.trim()
    let forecasts: any[]
    try {
      forecasts = JSON.parse(rawText)
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/)
      if (!match) throw new Error('AI returned invalid JSON')
      forecasts = JSON.parse(match[0])
    }

    // 7. Upsert to database
    const rows = forecasts.map((f: any) => ({
      business_id: businessId,
      product_id: f.product_id,
      forecast_date: f.forecast_date,
      predicted_qty: f.predicted_qty,
      lower_bound: f.lower_bound,
      upper_bound: f.upper_bound,
      confidence: f.confidence,
      trend: f.trend,
      change_pct: f.change_pct,
      generated_at: new Date().toISOString(),
    }))

    const { error: upsertErr } = await supabase
      .from('forecasts')
      .upsert(rows, { onConflict: 'product_id,forecast_date' })

    if (upsertErr) throw upsertErr

    return NextResponse.json({ success: true, count: rows.length })
  } catch (err: any) {
    console.error('Forecast error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}