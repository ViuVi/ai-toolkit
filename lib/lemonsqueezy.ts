// Lemon Squeezy Configuration & Helpers
// Production Ready - March 2025

export const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1'

// Environment variables (Vercel'de ayarlanacak)
export const getConfig = () => ({
  apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
  storeId: process.env.LEMONSQUEEZY_STORE_ID || '293836',
})

// Plan Variant IDs - Lemon Squeezy'den aldığın değerler
export const VARIANT_IDS = {
  PRO_MONTHLY: process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || process.env.PRO_MONTHLY_VARIANT_ID || '1384108',
  PRO_YEARLY: process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID || process.env.PRO_YEARLY_VARIANT_ID || '',
}

// Plan tanımları
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    nameTr: 'Ücretsiz',
    credits: 50,
    price: {
      monthly: 0,
      yearly: 0
    },
    features: {
      en: [
        '50 credits/month',
        'Access to free tools',
        'Basic support',
        'Watch ads for +2 credits'
      ],
      tr: [
        'Aylık 50 kredi',
        'Ücretsiz araçlara erişim',
        'Temel destek',
        'Reklam izle +2 kredi kazan'
      ]
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameTr: 'Pro',
    credits: 1000,
    price: {
      monthly: 4.99,
      yearly: 49.99
    },
    variantId: {
      monthly: VARIANT_IDS.PRO_MONTHLY,
      yearly: VARIANT_IDS.PRO_YEARLY
    },
    features: {
      en: [
        '1000 credits/month',
        'All AI tools',
        'Priority support',
        'No ads',
        'Early access to new features'
      ],
      tr: [
        'Aylık 1000 kredi',
        'Tüm AI araçları',
        'Öncelikli destek',
        'Reklamsız kullanım',
        'Yeni özelliklere erken erişim'
      ]
    }
  }
}

// API Helper - Lemon Squeezy API'ye istek gönder
export async function lemonSqueezyApi(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
) {
  const config = getConfig()
  
  const response = await fetch(`${LEMONSQUEEZY_API_URL}${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Lemon Squeezy API Error:', error)
    throw new Error(`Lemon Squeezy API error: ${response.status}`)
  }

  return response.json()
}

// Checkout URL oluştur
export async function createCheckout(
  variantId: string,
  userEmail: string,
  userId: string,
  redirectUrl?: string
) {
  const config = getConfig()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mediatoolkit.site'
  
  const requestBody = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: userEmail,
          custom: {
            user_id: userId
          }
        },
        checkout_options: {
          dark: true
        },
        product_options: {
          enabled_variants: [parseInt(variantId)],
          redirect_url: redirectUrl || `${appUrl}/dashboard?success=true`,
          receipt_thank_you_note: 'Thank you for subscribing to Media Tool Kit Pro!'
        },
        expires_at: null,
        preview: false
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: config.storeId
          }
        },
        variant: {
          data: {
            type: 'variants',
            id: variantId
          }
        }
      }
    }
  }

  console.log('Creating checkout with:', JSON.stringify(requestBody, null, 2))
  
  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Lemon Squeezy Checkout Error:', errorText)
    throw new Error(`Checkout failed: ${response.status} - ${errorText}`)
  }

  const checkout = await response.json()
  return checkout.data.attributes.url
}

// Müşteri portalı URL'si al
export async function getCustomerPortalUrl(customerId: string) {
  const customer = await lemonSqueezyApi(`/customers/${customerId}`)
  return customer.data.attributes.urls.customer_portal
}

// Aboneliği iptal et
export async function cancelSubscription(subscriptionId: string) {
  return lemonSqueezyApi(`/subscriptions/${subscriptionId}`, 'DELETE')
}

// Aboneliği duraklat
export async function pauseSubscription(subscriptionId: string) {
  return lemonSqueezyApi(`/subscriptions/${subscriptionId}`, 'PATCH', {
    data: {
      type: 'subscriptions',
      id: subscriptionId,
      attributes: {
        pause: {
          mode: 'void'
        }
      }
    }
  })
}

// Aboneliği devam ettir
export async function resumeSubscription(subscriptionId: string) {
  return lemonSqueezyApi(`/subscriptions/${subscriptionId}`, 'PATCH', {
    data: {
      type: 'subscriptions',
      id: subscriptionId,
      attributes: {
        pause: null
      }
    }
  })
}

// Webhook imzasını doğrula
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Plan bilgisini variant ID'den al
export function getPlanFromVariantId(variantId: string): 'pro' | 'free' {
  if (variantId === VARIANT_IDS.PRO_MONTHLY || variantId === VARIANT_IDS.PRO_YEARLY) {
    return 'pro'
  }
  return 'free'
}

// Kredi miktarını plan'a göre al
export function getCreditsForPlan(plan: 'free' | 'pro'): number {
  return PLANS[plan].credits
}
