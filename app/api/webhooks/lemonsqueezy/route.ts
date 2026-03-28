// Lemon Squeezy Webhook Handler
// Handles subscription events — writes to 'credits' table (single source of truth)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { getPlanFromVariantId, getCreditsForPlan } from '@/lib/lemonsqueezy'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not set')
    return false
  }

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''

    if (!verifySignature(rawBody, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta.event_name
    const customData = payload.meta.custom_data || {}
    const userId = customData.user_id

    console.log(`📥 Webhook received: ${eventName}`, { userId })

    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(payload, userId)
        break

      case 'subscription_updated':
        await handleSubscriptionUpdated(payload, userId)
        break

      case 'subscription_cancelled':
      case 'subscription_expired':
        await handleSubscriptionEnded(payload, userId)
        break

      case 'subscription_resumed':
      case 'subscription_unpaused':
        await handleSubscriptionResumed(payload, userId)
        break

      case 'subscription_paused':
        await handleSubscriptionPaused(payload, userId)
        break

      case 'order_created':
        console.log('Order created:', payload.data.id)
        break

      default:
        console.log(`Unhandled event: ${eventName}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// New subscription created — user upgraded to Pro
async function handleSubscriptionCreated(payload: any, userId: string) {
  const subscription = payload.data.attributes
  const subscriptionId = payload.data.id
  const customerId = subscription.customer_id.toString()
  const variantId = subscription.variant_id.toString()
  const renewsAt = subscription.renews_at
  const endsAt = subscription.ends_at

  const plan = getPlanFromVariantId(variantId)
  const credits = getCreditsForPlan(plan)

  console.log(`✅ Subscription created for user ${userId}:`, { plan, credits, subscriptionId, customerId })

  const { error } = await supabaseAdmin
    .from('credits')
    .update({
      plan,
      balance: credits,
      subscription_id: subscriptionId,
      customer_id: customerId,
      variant_id: variantId,
      renews_at: renewsAt,
      ends_at: endsAt,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating credits:', error)
    throw error
  }

  console.log(`✅ User ${userId} upgraded to ${plan} with ${credits} credits`)
}

// Subscription renewed or plan changed
async function handleSubscriptionUpdated(payload: any, userId: string) {
  const subscription = payload.data.attributes
  const subscriptionId = payload.data.id
  const variantId = subscription.variant_id.toString()
  const renewsAt = subscription.renews_at
  const endsAt = subscription.ends_at
  const status = subscription.status

  const plan = getPlanFromVariantId(variantId)
  const credits = getCreditsForPlan(plan)

  console.log(`🔄 Subscription updated for user ${userId}:`, { status, plan, renewsAt })

  if (status === 'active') {
    // Monthly renewal — reset credits to plan amount
    const { error } = await supabaseAdmin
      .from('credits')
      .update({
        plan,
        balance: credits,
        variant_id: variantId,
        renews_at: renewsAt,
        ends_at: endsAt,
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscriptionId)

    if (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }
}

// Subscription cancelled or expired — downgrade to free
async function handleSubscriptionEnded(payload: any, userId: string) {
  const subscriptionId = payload.data.id
  const subscription = payload.data.attributes
  const endsAt = subscription.ends_at

  console.log(`❌ Subscription ended for user ${userId}`)

  const { error } = await supabaseAdmin
    .from('credits')
    .update({
      plan: 'free',
      balance: 100,
      subscription_id: null,
      customer_id: null,
      variant_id: null,
      renews_at: null,
      ends_at: endsAt,
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId)

  if (error) {
    console.error('Error downgrading subscription:', error)
    throw error
  }
}

// Subscription resumed
async function handleSubscriptionResumed(payload: any, userId: string) {
  const subscription = payload.data.attributes
  const subscriptionId = payload.data.id
  const variantId = subscription.variant_id.toString()

  const plan = getPlanFromVariantId(variantId)
  const credits = getCreditsForPlan(plan)

  console.log(`▶️ Subscription resumed for user ${userId}`)

  const { error } = await supabaseAdmin
    .from('credits')
    .update({
      plan,
      balance: credits,
      renews_at: subscription.renews_at,
      ends_at: subscription.ends_at,
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId)

  if (error) {
    console.error('Error resuming subscription:', error)
    throw error
  }
}

// Subscription paused
async function handleSubscriptionPaused(payload: any, userId: string) {
  const subscriptionId = payload.data.id

  console.log(`⏸️ Subscription paused for user ${userId}`)

  const { error } = await supabaseAdmin
    .from('credits')
    .update({
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId)

  if (error) {
    console.error('Error pausing subscription:', error)
    throw error
  }
}
