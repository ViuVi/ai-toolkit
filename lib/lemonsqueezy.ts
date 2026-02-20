// Lemon Squeezy Configuration & Helpers

export const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1'

// Plan tanımları - Sadece Free ve Pro
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
        'Watch ads for credits'
      ],
      tr: [
        'Aylık 50 kredi',
        'Ücretsiz araçlara erişim',
        'Temel destek',
        'Reklam izle kredi kazan'
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
    features: {
      en: [
        '1000 credits/month',
        'All AI tools',
        'Priority support',
        'No ads',
        'Unlimited generations'
      ],
      tr: [
        'Aylık 1000 kredi',
        'Tüm AI araçlarına erişim',
        'Öncelikli destek',
        'Reklamsız kullanım',
        'Sınırsız üretim'
      ]
    },
    variantIds: {
      monthly: process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || '',
      yearly: process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID || ''
    }
  }
}

// API helper fonksiyonları
export async function lemonsqueezyApi(endpoint: string, options: RequestInit = {}) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  
  if (!apiKey) {
    throw new Error('LEMONSQUEEZY_API_KEY is not set')
  }

  const response = await fetch(LEMONSQUEEZY_API_URL + endpoint, {
    ...options,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + apiKey,
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.detail || 'Lemon Squeezy API error')
  }

  return data
}

// Checkout URL oluştur
export async function createCheckout(variantId: string, userId: string, userEmail: string) {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID
  
  if (!storeId) {
    throw new Error('LEMONSQUEEZY_STORE_ID is not set')
  }

  const checkout = await lemonsqueezyApi('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              user_id: userId
            },
            email: userEmail
          },
          product_options: {
            redirect_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?payment=success',
            receipt_thank_you_note: 'Thank you for subscribing to Media Tool Kit!'
          }
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId
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
    })
  })

  return checkout.data.attributes.url
}

// Müşteri portalı URL'si al
export async function getCustomerPortalUrl(customerId: string) {
  const customer = await lemonsqueezyApi('/customers/' + customerId)
  return customer.data.attributes.urls.customer_portal
}

// Abonelik iptal
export async function cancelSubscription(subscriptionId: string) {
  return lemonsqueezyApi('/subscriptions/' + subscriptionId, {
    method: 'DELETE'
  })
}

// Kredi miktarını plana göre al
export function getCreditsForPlan(planId: string): number {
  const plan = PLANS[planId as keyof typeof PLANS]
  return plan?.credits || 50
}
