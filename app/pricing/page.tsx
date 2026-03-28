'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

function PricingContent() {
  const [user, setUser] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [loading, setLoading] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, t } = useLanguage()

  // Success/cancelled mesajları
  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      // Mevcut planı kontrol et
      const { data: credits } = await supabase
        .from('credits')
        .select('plan')
        .eq('user_id', user.id)
        .single()
      
      if (credits?.plan) {
        setCurrentPlan(credits.plan)
      }
    }
  }

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }

    if (currentPlan === 'pro') {
      // Zaten Pro ise portal'a yönlendir
      await handleManageSubscription()
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          billingPeriod
        })
      })

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.error || 'Failed to create checkout')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/lemonsqueezy/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const data = await response.json()

      if (data.portalUrl) {
        window.location.href = data.portalUrl
      } else {
        alert(data.error || 'Failed to open portal')
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Çeviriler
  const texts = {
    en: {
      back: '← Back',
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your needs. No hidden fees.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save 17%',
      free: {
        name: 'Free',
        price: '$0',
        period: '/month',
        desc: 'Perfect for getting started',
        features: ['50 credits/month', 'Access to free tools', 'Basic support', 'Watch ads for +2 credits'],
        cta: 'Current Plan',
        ctaActive: 'Get Started'
      },
      pro: {
        name: 'Pro',
        priceMonthly: '$4.99',
        priceYearly: '$49.99',
        period: '/month',
        periodYearly: '/year',
        desc: 'For serious content creators',
        badge: 'Most Popular',
        features: ['1000 credits/month', 'All AI tools', 'Priority support', 'No ads', 'Early access to new features'],
        cta: 'Upgrade to Pro',
        ctaActive: 'Manage Subscription',
        loading: 'Processing...'
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          { q: 'What are credits?', a: 'Credits are used to generate content with our AI tools. Each tool uses different amounts of credits based on complexity.' },
          { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. Your access continues until the end of the current billing period.' },
          { q: 'Do unused credits roll over?', a: 'Credits reset at the beginning of each billing cycle. Unused credits do not carry over to the next month.' },
          { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and PayPal through our secure payment partner Lemon Squeezy.' }
        ]
      },
      success: '🎉 Welcome to Pro! Your account has been upgraded.',
      cancelled: 'Payment was cancelled. You can try again anytime.'
    },
    tr: {
      back: '← Geri',
      title: 'Basit, Şeffaf Fiyatlandırma',
      subtitle: 'İhtiyacınıza uygun planı seçin. Gizli ücret yok.',
      monthly: 'Aylık',
      yearly: 'Yıllık',
      save: '%17 Tasarruf',
      free: {
        name: 'Ücretsiz',
        price: '$0',
        period: '/ay',
        desc: 'Başlamak için mükemmel',
        features: ['Aylık 50 kredi', 'Ücretsiz araçlara erişim', 'Temel destek', 'Reklam izle +2 kredi kazan'],
        cta: 'Mevcut Plan',
        ctaActive: 'Başla'
      },
      pro: {
        name: 'Pro',
        priceMonthly: '$4.99',
        priceYearly: '$49.99',
        period: '/ay',
        periodYearly: '/yıl',
        desc: 'Ciddi içerik üreticileri için',
        badge: 'En Popüler',
        features: ['Aylık 1000 kredi', 'Tüm AI araçları', 'Öncelikli destek', 'Reklamsız', 'Yeni özelliklere erken erişim'],
        cta: 'Pro\'ya Yükselt',
        ctaActive: 'Aboneliği Yönet',
        loading: 'İşleniyor...'
      },
      faq: {
        title: 'Sıkça Sorulan Sorular',
        items: [
          { q: 'Krediler nedir?', a: 'Krediler AI araçlarıyla içerik üretmek için kullanılır. Her araç karmaşıklığına göre farklı miktarda kredi kullanır.' },
          { q: 'İstediğim zaman iptal edebilir miyim?', a: 'Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Erişiminiz mevcut fatura döneminin sonuna kadar devam eder.' },
          { q: 'Kullanılmayan krediler bir sonraki aya aktarılır mı?', a: 'Krediler her fatura döneminin başında sıfırlanır. Kullanılmayan krediler bir sonraki aya aktarılmaz.' },
          { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Güvenli ödeme ortağımız Lemon Squeezy aracılığıyla tüm büyük kredi kartlarını, banka kartlarını ve PayPal\'ı kabul ediyoruz.' }
        ]
      },
      success: '🎉 Pro\'ya hoş geldiniz! Hesabınız yükseltildi.',
      cancelled: 'Ödeme iptal edildi. İstediğiniz zaman tekrar deneyebilirsiniz.'
    }
  }

  const txt = texts[language as keyof typeof texts] || texts.en

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            {txt.back}
          </Link>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Media Tool Kit
          </Link>
          {user ? (
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-gray-400 hover:text-white transition">
              {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Success/Cancelled Messages */}
        {success && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center text-green-400">
            {txt.success}
          </div>
        )}
        {cancelled && (
          <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center text-yellow-400">
            {txt.cancelled}
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{txt.title}</h1>
          <p className="text-xl text-gray-400">{txt.subtitle}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}>
            {txt.monthly}
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors"
          >
            <div className={`absolute top-1 w-5 h-5 bg-purple-500 rounded-full transition-transform ${billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
          <span className={billingPeriod === 'yearly' ? 'text-white' : 'text-gray-500'}>
            {txt.yearly}
          </span>
          {billingPeriod === 'yearly' && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              {txt.save}
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">{txt.free.name}</h3>
            <p className="text-gray-400 mb-6">{txt.free.desc}</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">{txt.free.price}</span>
              <span className="text-gray-400">{txt.free.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {txt.free.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {currentPlan === 'free' ? (
              <div className="w-full py-3 bg-gray-700 text-gray-400 rounded-xl text-center font-semibold">
                {txt.free.cta}
              </div>
            ) : (
              <Link
                href="/register"
                className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-center rounded-xl font-semibold transition"
              >
                {txt.free.ctaActive}
              </Link>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
              {txt.pro.badge}
            </div>
            <h3 className="text-2xl font-bold mb-2">{txt.pro.name}</h3>
            <p className="text-gray-400 mb-6">{txt.pro.desc}</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">
                {billingPeriod === 'yearly' ? txt.pro.priceYearly : txt.pro.priceMonthly}
              </span>
              <span className="text-gray-400">
                {billingPeriod === 'yearly' ? txt.pro.periodYearly : txt.pro.period}
              </span>
              {billingPeriod === 'yearly' && (
                <div className="text-sm text-green-400 mt-1">
                  {language === 'tr' ? '2 ay bedava!' : '2 months free!'}
                </div>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {txt.pro.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? txt.pro.loading : currentPlan === 'pro' ? txt.pro.ctaActive : txt.pro.cta}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">{txt.faq.title}</h2>
          <div className="space-y-4">
            {txt.faq.items.map((item, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>{language === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span>{language === 'tr' ? 'Tüm Kartlar' : 'All Cards Accepted'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>{language === 'tr' ? 'İstediğin Zaman İptal' : 'Cancel Anytime'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
