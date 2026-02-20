'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState('free')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subscription) {
        setCurrentPlan(subscription.plan_id)
      }
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/register?redirect=pricing')
      return
    }

    if (currentPlan === 'pro') return

    setLoading(true)

    try {
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'pro',
          billingPeriod,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const yearlyDiscount = Math.round((1 - 49.99 / (4.99 * 12)) * 100)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">M</span>
            </div>
            <span className="text-xl font-bold">Media Tool Kit</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={'px-2 py-1 rounded text-xs transition ' + (language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400')}>EN</button>
              <button onClick={() => setLanguage('tr')} className={'px-2 py-1 rounded text-xs transition ' + (language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400')}>TR</button>
            </div>
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition">
                {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'tr' ? 'Basit Fiyatlandırma' : 'Simple Pricing'}
          </h1>
          <p className="text-xl text-gray-400">
            {language === 'tr' ? 'İhtiyacınıza uygun planı seçin' : 'Choose the plan that fits your needs'}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={'transition ' + (billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400')}>
            {language === 'tr' ? 'Aylık' : 'Monthly'}
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-gray-700 rounded-full transition"
          >
            <div className={'absolute top-1 w-6 h-6 bg-purple-500 rounded-full transition-all ' + (billingPeriod === 'yearly' ? 'left-9' : 'left-1')} />
          </button>
          <span className={'transition ' + (billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400')}>
            {language === 'tr' ? 'Yıllık' : 'Yearly'}
          </span>
          {billingPeriod === 'yearly' && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">
              {language === 'tr' ? `%${yearlyDiscount} Tasarruf` : `Save ${yearlyDiscount}%`}
            </span>
          )}
        </div>

        {/* Plans - 2 Column */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{language === 'tr' ? 'Ücretsiz' : 'Free'}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/{language === 'tr' ? 'ay' : 'mo'}</span>
              </div>
              <p className="text-gray-400 mt-2">50 {language === 'tr' ? 'kredi/ay' : 'credits/mo'}</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Aylık 50 kredi' : '50 credits/month'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Ücretsiz araçlara erişim' : 'Access to free tools'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Temel destek' : 'Basic support'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Reklam izle kredi kazan' : 'Watch ads for credits'}</span>
              </li>
            </ul>

            <button
              disabled={true}
              className="w-full py-3 rounded-xl font-bold bg-gray-700 text-gray-400 cursor-not-allowed"
            >
              {currentPlan === 'free' 
                ? (language === 'tr' ? 'Mevcut Plan' : 'Current Plan')
                : (language === 'tr' ? 'Ücretsiz Başla' : 'Start Free')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-purple-500 bg-purple-500/10 p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-sm font-bold">
              {language === 'tr' ? 'Önerilen' : 'Recommended'}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">${billingPeriod === 'yearly' ? '49.99' : '4.99'}</span>
                <span className="text-gray-400">/{language === 'tr' ? (billingPeriod === 'yearly' ? 'yıl' : 'ay') : (billingPeriod === 'yearly' ? 'year' : 'mo')}</span>
              </div>
              <p className="text-gray-400 mt-2">1000 {language === 'tr' ? 'kredi/ay' : 'credits/mo'}</p>
              {billingPeriod === 'yearly' && (
                <p className="text-green-400 text-sm mt-1">
                  {language === 'tr' ? '2 ay bedava!' : '2 months free!'}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Aylık 1000 kredi' : '1000 credits/month'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Tüm AI araçlarına erişim' : 'All AI tools'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Öncelikli destek' : 'Priority support'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Reklamsız kullanım' : 'No ads'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{language === 'tr' ? 'Sınırsız üretim' : 'Unlimited generations'}</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading || currentPlan === 'pro'}
              className={'w-full py-3 rounded-xl font-bold transition ' + (
                currentPlan === 'pro'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </span>
              ) : currentPlan === 'pro' ? (
                language === 'tr' ? 'Mevcut Plan' : 'Current Plan'
              ) : (
                language === 'tr' ? 'Pro\'ya Geç' : 'Upgrade to Pro'
              )}
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'tr' ? 'Özellik Karşılaştırması' : 'Feature Comparison'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4">{language === 'tr' ? 'Özellik' : 'Feature'}</th>
                  <th className="text-center py-4 px-4">{language === 'tr' ? 'Ücretsiz' : 'Free'}</th>
                  <th className="text-center py-4 px-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">{language === 'tr' ? 'Aylık Kredi' : 'Monthly Credits'}</td>
                  <td className="text-center py-4 px-4">50</td>
                  <td className="text-center py-4 px-4 text-purple-400 font-bold">1000</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">{language === 'tr' ? 'AI Araçları' : 'AI Tools'}</td>
                  <td className="text-center py-4 px-4">{language === 'tr' ? 'Temel' : 'Basic'}</td>
                  <td className="text-center py-4 px-4 text-purple-400">✓ {language === 'tr' ? 'Tümü' : 'All'}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">{language === 'tr' ? 'Reklamlar' : 'Ads'}</td>
                  <td className="text-center py-4 px-4">{language === 'tr' ? 'Var' : 'Yes'}</td>
                  <td className="text-center py-4 px-4 text-green-400">✗ {language === 'tr' ? 'Yok' : 'None'}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">{language === 'tr' ? 'Destek' : 'Support'}</td>
                  <td className="text-center py-4 px-4">{language === 'tr' ? 'Temel' : 'Basic'}</td>
                  <td className="text-center py-4 px-4 text-purple-400">{language === 'tr' ? 'Öncelikli' : 'Priority'}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">{language === 'tr' ? 'Reklam ile Kredi' : 'Ads for Credits'}</td>
                  <td className="text-center py-4 px-4 text-green-400">✓</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ'}
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold mb-2">{language === 'tr' ? 'Kredi nedir?' : 'What are credits?'}</h3>
              <p className="text-gray-400">
                {language === 'tr' 
                  ? 'Krediler, AI araçlarını kullanmak için harcadığınız birimlerdir. Her araç farklı miktarda kredi kullanır.'
                  : 'Credits are units you spend to use AI tools. Each tool uses different amounts of credits.'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold mb-2">{language === 'tr' ? 'İstediğim zaman iptal edebilir miyim?' : 'Can I cancel anytime?'}</h3>
              <p className="text-gray-400">
                {language === 'tr' 
                  ? 'Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar erişiminiz devam eder.'
                  : 'Yes! You can cancel your subscription anytime. You\'ll retain access until the end of your billing period.'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold mb-2">{language === 'tr' ? 'Hangi ödeme yöntemlerini kabul ediyorsunuz?' : 'What payment methods do you accept?'}</h3>
              <p className="text-gray-400">
                {language === 'tr' 
                  ? 'Kredi kartı, banka kartı ve PayPal ile ödeme yapabilirsiniz.'
                  : 'We accept credit cards, debit cards, and PayPal.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2024 Media Tool Kit. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  )
}
