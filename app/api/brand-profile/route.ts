import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data } = await supabaseAdmin
      .from('brand_profiles').select('*').eq('user_id', user.id).single()

    return NextResponse.json({ profile: data || null })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { brandName, niche, targetAudience, tone, contentStyle, platforms, keywords, description } = await request.json()

    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .upsert({
        user_id: user.id, brand_name: brandName || '', niche: niche || '',
        target_audience: targetAudience || '', tone: tone || 'professional',
        content_style: contentStyle || 'educational', platforms: platforms || ['tiktok', 'instagram'],
        keywords: keywords || [], description: description || '', updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select().single()

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    return NextResponse.json({ success: true, profile: data })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
