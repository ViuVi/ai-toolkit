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

    const tool = request.nextUrl.searchParams.get('tool')
    const favOnly = request.nextUrl.searchParams.get('favorites') === 'true'
    const search = request.nextUrl.searchParams.get('search')
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = 20

    let query = supabaseAdmin
      .from('saved_contents')
      .select('id, tool_name, tool_display_name, input_summary, is_favorite, created_at, result', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (tool && tool !== 'all') query = query.eq('tool_name', tool)
    if (favOnly) query = query.eq('is_favorite', true)
    if (search) query = query.ilike('input_summary', `%${search}%`)

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

    return NextResponse.json({ items: data || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action, contentId } = await request.json()
    if (!contentId) return NextResponse.json({ error: 'Missing contentId' }, { status: 400 })

    if (action === 'favorite') {
      const { data: existing } = await supabaseAdmin
        .from('saved_contents').select('is_favorite').eq('id', contentId).eq('user_id', user.id).single()
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      await supabaseAdmin.from('saved_contents').update({ is_favorite: !existing.is_favorite }).eq('id', contentId).eq('user_id', user.id)
      return NextResponse.json({ success: true, is_favorite: !existing.is_favorite })
    }

    if (action === 'delete') {
      await supabaseAdmin.from('saved_contents').delete().eq('id', contentId).eq('user_id', user.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
