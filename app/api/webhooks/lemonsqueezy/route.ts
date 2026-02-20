import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { getCreditsForPlan } from '@/lib/lemonsqueezy'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Webhook imzasını doğrula
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not set')
    return false
  }

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-signature') || ''

    // İmza doğrulama
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    const eventName = event.meta.event_name
    const data = event.data

    console.log('🔔 Lemon Squeezy Webhook:', eventName)

    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(data, event.meta.custom_data)
        break

      case 'subscription_updated':
        await handleSubscriptionUpdated(data)
        break

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data)
        break

      case 'subscription_resumed':
        await handleSubscriptionResumed(data)
        break

      case 'subscription_payment_success':
        await handlePaymentSuccess(data)
        break

      case 'subscription_payment_failed':
        await handlePaymentFailed(data)
        break

      default:
        console.log('Unhandled event:', eventName)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Yeni abonelik oluşturuldu
async function handleSubscriptionCreated(data: any, customData: any) {
  const userId = customData?.user_id
  if (!userId) {
    console.error('No user_id in custom data')
    return
  }

  const subscriptionId = data.id
  const customerId = data.attributes.customer_id
  const variantId = data.attributes.variant_id
  const status = data.attributes.status
  const currentPeriodEnd = data.attributes.renews_at

  // Plan ID'yi variant'a göre belirle
  const planId = getPlanFromVariant(String(variantId))
  const credits = getCreditsForPlan(planId)

  // Abonelik kaydı oluştur
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    lemonsqueezy_subscription_id: String(subscriptionId),
    lemonsqueezy_customer_id: String(customerId),
    lemonsqueezy_variant_id: String(variantId),
    plan_id: planId,
    status: status,
    current_period_end: currentPeriodEnd,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  // Kredileri güncelle
  await supabase.from('credits').upsert({
    user_id: userId,
    balance: credits,
    total_used: 0,
    plan: planId,
    updated_at: new Date().toISOString()
  })

  console.log('✅ Subscription created for user:', userId, 'Plan:', planId)
}

// Abonelik güncellendi (plan değişikliği)
async function handleSubscriptionUpdated(data: any) {
  const subscriptionId = data.id
  const variantId = data.attributes.variant_id
  const status = data.attributes.status
  const currentPeriodEnd = data.attributes.renews_at

  const planId = getPlanFromVariant(String(variantId))

  // Abonelik kaydını güncelle
  const { data: subscription } = await supabase
    .from('subscriptions')
    .update({
      lemonsqueezy_variant_id: String(variantId),
      plan_id: planId,
      status: status,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString()
    })
    .eq('lemonsqueezy_subscription_id', String(subscriptionId))
    .select('user_id')
    .single()

  if (subscription) {
    const credits = getCreditsForPlan(planId)
    await supabase.from('credits').update({
      plan: planId,
      balance: credits,
      updated_at: new Date().toISOString()
    }).eq('user_id', subscription.user_id)
  }

  console.log('✅ Subscription updated:', subscriptionId)
}

// Abonelik iptal edildi
async function handleSubscriptionCancelled(data: any) {
  const subscriptionId = data.id

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('lemonsqueezy_subscription_id', String(subscriptionId))

  console.log('⚠️ Subscription cancelled:', subscriptionId)
}

// Abonelik devam ettirildi
async function handleSubscriptionResumed(data: any) {
  const subscriptionId = data.id
  const status = data.attributes.status

  await supabase
    .from('subscriptions')
    .update({
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('lemonsqueezy_subscription_id', String(subscriptionId))

  console.log('✅ Subscription resumed:', subscriptionId)
}

// Ödeme başarılı - kredileri yenile
async function handlePaymentSuccess(data: any) {
  const subscriptionId = data.attributes.subscription_id

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id, plan_id')
    .eq('lemonsqueezy_subscription_id', String(subscriptionId))
    .single()

  if (subscription) {
    const credits = getCreditsForPlan(subscription.plan_id)
    
    await supabase.from('credits').update({
      balance: credits,
      updated_at: new Date().toISOString()
    }).eq('user_id', subscription.user_id)

    console.log('✅ Credits refreshed for user:', subscription.user_id)
  }
}

// Ödeme başarısız
async function handlePaymentFailed(data: any) {
  const subscriptionId = data.attributes.subscription_id
  
  console.log('❌ Payment failed for subscription:', subscriptionId)
  // Kullanıcıya email gönderilebilir
}

// Variant ID'den plan ID'yi belirle
function getPlanFromVariant(variantId: string): string {
  const proMonthly = process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID
  const proYearly = process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID
  const businessMonthly = process.env.LEMONSQUEEZY_BUSINESS_MONTHLY_VARIANT_ID
  const businessYearly = process.env.LEMONSQUEEZY_BUSINESS_YEARLY_VARIANT_ID

  if (variantId === proMonthly || variantId === proYearly) {
    return 'pro'
  }
  if (variantId === businessMonthly || variantId === businessYearly) {
    return 'business'
  }
  return 'free'
}
