import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, brandName, niche, targetAudience, tone, contentStyle, platforms, keywords, description } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const profileData = {
      user_id: userId,
      brand_name: brandName || '',
      niche: niche || '',
      target_audience: targetAudience || '',
      tone: tone || 'professional',
      content_style: contentStyle || 'educational',
      platforms: platforms || ['tiktok', 'instagram'],
      keywords: keywords || [],
      description: description || '',
      updated_at: new Date().toISOString()
    }

    // Upsert - varsa güncelle, yoksa oluştur
    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Brand profile error:', error)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
