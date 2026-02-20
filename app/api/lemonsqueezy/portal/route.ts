import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCustomerPortalUrl } from '@/lib/lemonsqueezy'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Kullanıcının abonelik bilgisini al
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('lemonsqueezy_customer_id')
      .eq('user_id', userId)
      .single()

    if (error || !subscription?.lemonsqueezy_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Portal URL al
    const portalUrl = await getCustomerPortalUrl(subscription.lemonsqueezy_customer_id)

    return NextResponse.json({ portalUrl })

  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to get portal URL' },
      { status: 500 }
    )
  }
}
