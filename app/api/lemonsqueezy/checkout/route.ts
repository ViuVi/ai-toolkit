import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCheckout, PLANS } from '@/lib/lemonsqueezy'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const planId = body.planId
    const billingPeriod = body.billingPeriod
    const userId = body.userId

    if (!planId || !billingPeriod || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Kullanıcıyı doğrula
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Plan kontrolü
    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan || planId === 'free') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Variant ID al
    const planWithVariants = plan as typeof PLANS.pro
    const variantId = billingPeriod === 'yearly' 
      ? planWithVariants.variantIds?.yearly 
      : planWithVariants.variantIds?.monthly

    if (!variantId) {
      return NextResponse.json(
        { error: 'Plan variant not configured' },
        { status: 500 }
      )
    }

    // Checkout URL oluştur
    const checkoutUrl = await createCheckout(
      variantId,
      userId,
      userData.user.email || ''
    )

    return NextResponse.json({ checkoutUrl })

  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
