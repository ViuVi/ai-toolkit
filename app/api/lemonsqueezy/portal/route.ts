// Customer Portal API Route - Redirects to Lemon Squeezy customer portal
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCustomerPortalUrl } from '@/lib/lemonsqueezy'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read from credits table (single source of truth)
    const { data: creditData, error: creditsError } = await supabaseAdmin
      .from('credits')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (creditsError || !creditData?.customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const portalUrl = await getCustomerPortalUrl(creditData.customer_id)

    return NextResponse.json({ portalUrl })

  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get portal URL' },
      { status: 500 }
    )
  }
}
