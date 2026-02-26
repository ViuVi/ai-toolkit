'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'

// 5 DİLLİ ÇEVİRİLER
const texts: Record<Language, any> = {
  en: {
    signIn: 'Sign In',
    dashboard: 'Dashboard',
    title: 'Simple Pricing',
    subtitle: 'Choose the plan that fits your needs',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save',
    recommended: 'Recommended',
    free: {
      name: 'Free',
      price: '$0',
      period: '/mo',
      credits: '50 credits/mo',
      features: ['50 credits/month', 'Access to free tools', 'Basic support', 'Watch ads for credits'],
      cta: 'Start Free',
      current: 'Current Plan'
    },
    pro: {
      name: 'Pro',
      period: '/mo',
      periodYearly: '/year',
      credits: '1000 credits/mo',
      freeMonths: '2 months free!',
      features: ['1000 credits/month', 'All AI tools', 'Priority support', 'No ads', 'Unlimited generations'],
      cta: 'Upgrade to Pro',
      current: 'Current Plan',
      loading: 'Loading...'
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What are credits?', a: 'Credits are used to generate content with our AI tools. Each tool requires a different amount of credits.' },
        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your access continues until the end of the billing period.' },
        { q: 'What payment methods?', a: 'We accept all major credit cards, debit cards, and PayPal through our secure payment partner.' },
        { q: 'Do unused credits roll over?', a: 'Credits reset at the beginning of each billing cycle. Unused credits do not roll over.' }
      ]
    },
    guarantee: {
      title: '30-Day Money Back Guarantee',
      text: "If you're not satisfied with Pro, contact us within 30 days for a full refund."
    }
  },
  tr: {
    signIn: 'Giriş Yap',
    dashboard: 'Panel',
    title: 'Basit Fiyatlandırma',
    subtitle: 'İhtiyacınıza uygun planı seçin',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    save: 'Tasarruf',
    recommended: 'Önerilen',
    free: {
      name: 'Ücretsiz',
      price: '$0',
      period: '/ay',
      credits: '50 kredi/ay',
      features: ['Aylık 50 kredi', 'Ücretsiz araçlara erişim', 'Temel destek', 'Reklam izle kredi kazan'],
      cta: 'Ücretsiz Başla',
      current: 'Mevcut Plan'
    },
    pro: {
      name: 'Pro',
      period: '/ay',
      periodYearly: '/yıl',
      credits: '1000 kredi/ay',
      freeMonths: '2 ay bedava!',
      features: ['Aylık 1000 kredi', 'Tüm AI araçlarına erişim', 'Öncelikli destek', 'Reklamsız kullanım', 'Sınırsız üretim'],
      cta: "Pro'ya Geç",
      current: 'Mevcut Plan',
      loading: 'Yükleniyor...'
    },
    faq: {
      title: 'Sık Sorulan Sorular',
      items: [
        { q: 'Krediler nedir?', a: 'Krediler, AI araçlarıyla içerik üretmek için kullanılır. Her araç farklı miktarda kredi gerektirir.' },
        { q: 'İstediğim zaman iptal edebilir miyim?', a: 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Erişiminiz fatura döneminin sonuna kadar devam eder.' },
        { q: 'Hangi ödeme yöntemleri?', a: 'Güvenli ödeme ortağımız aracılığıyla tüm büyük kredi kartları, banka kartları ve PayPal kabul ediyoruz.' },
        { q: 'Kullanılmayan krediler aktarılır mı?', a: 'Krediler her fatura döneminin başında sıfırlanır. Kullanılmayan krediler aktarılmaz.' }
      ]
    },
    guarantee: {
      title: '30 Gün Para İade Garantisi',
      text: "Pro'dan memnun kalmazsanız, 30 gün içinde tam geri ödeme için bizimle iletişime geçin."
    }
  },
  ru: {
    signIn: 'Войти',
    dashboard: 'Панель',
    title: 'Простые цены',
    subtitle: 'Выберите подходящий план',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    save: 'Скидка',
    recommended: 'Рекомендуется',
    free: {
      name: 'Бесплатно',
      price: '$0',
      period: '/мес',
      credits: '50 кредитов/мес',
      features: ['50 кредитов/месяц', 'Бесплатные инструменты', 'Базовая поддержка', 'Реклама за кредиты'],
      cta: 'Начать бесплатно',
      current: 'Текущий план'
    },
    pro: {
      name: 'Pro',
      period: '/мес',
      periodYearly: '/год',
      credits: '1000 кредитов/мес',
      freeMonths: '2 месяца бесплатно!',
      features: ['1000 кредитов/месяц', 'Все AI инструменты', 'Приоритетная поддержка', 'Без рекламы', 'Безлимит'],
      cta: 'Перейти на Pro',
      current: 'Текущий план',
      loading: 'Загрузка...'
    },
    faq: {
      title: 'Часто задаваемые вопросы',
      items: [
        { q: 'Что такое кредиты?', a: 'Кредиты используются для создания контента с помощью AI.' },
        { q: 'Можно ли отменить?', a: 'Да, вы можете отменить подписку в любое время.' },
        { q: 'Способы оплаты?', a: 'Мы принимаем все основные карты и PayPal.' },
        { q: 'Кредиты переносятся?', a: 'Кредиты сбрасываются в начале каждого периода.' }
      ]
    },
    guarantee: {
      title: '30-дневная гарантия возврата',
      text: 'Если вы не удовлетворены, свяжитесь с нами в течение 30 дней для возврата.'
    }
  },
  de: {
    signIn: 'Anmelden',
    dashboard: 'Dashboard',
    title: 'Einfache Preise',
    subtitle: 'Wählen Sie den passenden Plan',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    save: 'Sparen',
    recommended: 'Empfohlen',
    free: {
      name: 'Kostenlos',
      price: '$0',
      period: '/Mo',
      credits: '50 Credits/Mo',
      features: ['50 Credits/Monat', 'Kostenlose Tools', 'Basis-Support', 'Werbung für Credits'],
      cta: 'Kostenlos starten',
      current: 'Aktueller Plan'
    },
    pro: {
      name: 'Pro',
      period: '/Mo',
      periodYearly: '/Jahr',
      credits: '1000 Credits/Mo',
      freeMonths: '2 Monate gratis!',
      features: ['1000 Credits/Monat', 'Alle AI-Tools', 'Prioritäts-Support', 'Keine Werbung', 'Unbegrenzt'],
      cta: 'Auf Pro upgraden',
      current: 'Aktueller Plan',
      loading: 'Laden...'
    },
    faq: {
      title: 'Häufige Fragen',
      items: [
        { q: 'Was sind Credits?', a: 'Credits werden verwendet, um mit AI-Tools Inhalte zu erstellen.' },
        { q: 'Kann ich jederzeit kündigen?', a: 'Ja, Sie können Ihr Abo jederzeit kündigen.' },
        { q: 'Zahlungsmethoden?', a: 'Wir akzeptieren alle gängigen Karten und PayPal.' },
        { q: 'Werden Credits übertragen?', a: 'Credits werden am Anfang jedes Zeitraums zurückgesetzt.' }
      ]
    },
    guarantee: {
      title: '30-Tage-Geld-zurück-Garantie',
      text: 'Kontaktieren Sie uns innerhalb von 30 Tagen für eine Rückerstattung.'
    }
  },
  fr: {
    signIn: 'Connexion',
    dashboard: 'Tableau de bord',
    title: 'Tarifs simples',
    subtitle: 'Choisissez le plan qui vous convient',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    save: 'Économie',
    recommended: 'Recommandé',
    free: {
      name: 'Gratuit',
      price: '$0',
      period: '/mois',
      credits: '50 crédits/mois',
      features: ['50 crédits/mois', 'Outils gratuits', 'Support basique', 'Pubs pour crédits'],
      cta: 'Commencer gratuitement',
      current: 'Plan actuel'
    },
    pro: {
      name: 'Pro',
      period: '/mois',
      periodYearly: '/an',
      credits: '1000 crédits/mois',
      freeMonths: '2 mois gratuits!',
      features: ['1000 crédits/mois', 'Tous les outils IA', 'Support prioritaire', 'Sans pub', 'Illimité'],
      cta: 'Passer à Pro',
      current: 'Plan actuel',
      loading: 'Chargement...'
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        { q: 'Que sont les crédits?', a: 'Les crédits sont utilisés pour créer du contenu avec nos outils IA.' },
        { q: 'Puis-je annuler?', a: 'Oui, vous pouvez annuler à tout moment.' },
        { q: 'Modes de paiement?', a: 'Nous acceptons toutes les cartes principales et PayPal.' },
        { q: 'Les crédits sont reportés?', a: 'Les crédits sont réinitialisés au début de chaque période.' }
      ]
    },
    guarantee: {
      title: 'Garantie de remboursement 30 jours',
      text: 'Contactez-nous dans les 30 jours pour un remboursement complet.'
    }
  }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState('free')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language]

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const { data: subscription } = await supabase.from('subscriptions').select('plan_id, status').eq('user_id', user.id).eq('status', 'active').single()
      if (subscription) setCurrentPlan(subscription.plan_id)
    }
  }

  const handleSubscribe = async () => {
    if (!user) { router.push('/register?redirect=pricing'); return }
    if (currentPlan === 'pro') return
    setLoading(true)
    try {
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pro', billingPeriod, userId: user.id })
      })
      const data = await response.json()
      if (data.checkoutUrl) window.location.href = data.checkoutUrl
    } catch (error) { console.error(error) }
    setLoading(false)
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
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700">
                <span>🌐</span><span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition">{t.dashboard}</Link>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition">{t.signIn}</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}>{t.monthly}</span>
          <button onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')} className="relative w-16 h-8 bg-gray-700 rounded-full">
            <div className={`absolute top-1 w-6 h-6 bg-purple-500 rounded-full transition-all ${billingPeriod === 'yearly' ? 'left-9' : 'left-1'}`} />
          </button>
          <span className={billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400'}>{t.yearly}</span>
          {billingPeriod === 'yearly' && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-medium">{t.save} {yearlyDiscount}%</span>
          )}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t.free.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{t.free.price}</span>
                <span className="text-gray-400">{t.free.period}</span>
              </div>
              <p className="text-gray-400 mt-2">{t.free.credits}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {t.free.features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2"><span className="text-green-400">✓</span><span className="text-gray-300">{f}</span></li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-xl font-bold bg-gray-700 text-gray-400 cursor-not-allowed">
              {currentPlan === 'free' ? t.free.current : t.free.cta}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-purple-500 bg-purple-500/10 p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-sm font-bold">{t.recommended}</div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t.pro.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">${billingPeriod === 'yearly' ? '49.99' : '4.99'}</span>
                <span className="text-gray-400">{billingPeriod === 'yearly' ? t.pro.periodYearly : t.pro.period}</span>
              </div>
              <p className="text-gray-400 mt-2">{t.pro.credits}</p>
              {billingPeriod === 'yearly' && <p className="text-green-400 text-sm mt-1">{t.pro.freeMonths}</p>}
            </div>
            <ul className="space-y-3 mb-8">
              {t.pro.features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2"><span className="text-green-400">✓</span><span className="text-gray-300">{f}</span></li>
              ))}
            </ul>
            <button onClick={handleSubscribe} disabled={loading || currentPlan === 'pro'} className={`w-full py-3 rounded-xl font-bold transition ${currentPlan === 'pro' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
              {loading ? t.pro.loading : currentPlan === 'pro' ? t.pro.current : t.pro.cta}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold mb-2">{t.guarantee.title}</h3>
          <p className="text-gray-400">{t.guarantee.text}</p>
        </div>
      </main>
    </div>
  )
}
