'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '@/components/Footer'

const headerTexts: Record<string, Record<string, string>> = {
  en: { home: 'Home', dashboard: 'Dashboard' },
  tr: { home: 'Ana Sayfa', dashboard: 'Dashboard' },
  ru: { home: 'Главная', dashboard: 'Панель' },
  de: { home: 'Startseite', dashboard: 'Dashboard' },
  fr: { home: 'Accueil', dashboard: 'Tableau de bord' }
}

const content: Record<string, any> = {
  en: {
    title: 'Contact Us',
    subtitle: 'Have a question or feedback? We\'d love to hear from you.',
    form: {
      name: 'Your Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully! We\'ll get back to you soon.',
      error: 'Something went wrong. Please try again.'
    },
    subjects: ['General Inquiry', 'Technical Support', 'Billing Question', 'Feature Request', 'Partnership', 'Other'],
    info: {
      title: 'Other Ways to Reach Us',
      email: 'Email',
      response: 'Response Time',
      responseText: 'Usually within 24 hours',
      social: 'Social Media'
    }
  },
  tr: {
    title: 'Bize Ulaşın',
    subtitle: 'Sorunuz veya geri bildiriminiz mi var? Sizden haber almaktan memnuniyet duyarız.',
    form: {
      name: 'Adınız',
      email: 'E-posta Adresi',
      subject: 'Konu',
      message: 'Mesaj',
      submit: 'Mesaj Gönder',
      sending: 'Gönderiliyor...',
      success: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
      error: 'Bir şeyler yanlış gitti. Lütfen tekrar deneyin.'
    },
    subjects: ['Genel Soru', 'Teknik Destek', 'Fatura Sorusu', 'Özellik İsteği', 'Ortaklık', 'Diğer'],
    info: {
      title: 'Diğer İletişim Yolları',
      email: 'E-posta',
      response: 'Yanıt Süresi',
      responseText: 'Genellikle 24 saat içinde',
      social: 'Sosyal Medya'
    }
  },
  ru: {
    title: 'Свяжитесь с нами',
    subtitle: 'Есть вопрос или отзыв? Мы будем рады услышать вас.',
    form: {
      name: 'Ваше имя',
      email: 'Электронная почта',
      subject: 'Тема',
      message: 'Сообщение',
      submit: 'Отправить',
      sending: 'Отправка...',
      success: 'Сообщение отправлено! Мы скоро ответим.',
      error: 'Что-то пошло не так. Попробуйте снова.'
    },
    subjects: ['Общий вопрос', 'Техподдержка', 'Вопрос по оплате', 'Запрос функции', 'Партнерство', 'Другое'],
    info: {
      title: 'Другие способы связи',
      email: 'Email',
      response: 'Время ответа',
      responseText: 'Обычно в течение 24 часов',
      social: 'Социальные сети'
    }
  },
  de: {
    title: 'Kontaktieren Sie uns',
    subtitle: 'Haben Sie eine Frage oder Feedback? Wir freuen uns von Ihnen zu hören.',
    form: {
      name: 'Ihr Name',
      email: 'E-Mail-Adresse',
      subject: 'Betreff',
      message: 'Nachricht',
      submit: 'Nachricht senden',
      sending: 'Wird gesendet...',
      success: 'Nachricht erfolgreich gesendet! Wir melden uns bald.',
      error: 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.'
    },
    subjects: ['Allgemeine Anfrage', 'Technischer Support', 'Abrechnungsfrage', 'Feature-Anfrage', 'Partnerschaft', 'Sonstiges'],
    info: {
      title: 'Weitere Kontaktmöglichkeiten',
      email: 'E-Mail',
      response: 'Antwortzeit',
      responseText: 'Normalerweise innerhalb von 24 Stunden',
      social: 'Soziale Medien'
    }
  },
  fr: {
    title: 'Contactez-nous',
    subtitle: 'Une question ou un commentaire? Nous serions ravis de vous entendre.',
    form: {
      name: 'Votre nom',
      email: 'Adresse e-mail',
      subject: 'Sujet',
      message: 'Message',
      submit: 'Envoyer le message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès! Nous vous répondrons bientôt.',
      error: 'Une erreur s\'est produite. Veuillez réessayer.'
    },
    subjects: ['Demande générale', 'Support technique', 'Question de facturation', 'Demande de fonctionnalité', 'Partenariat', 'Autre'],
    info: {
      title: 'Autres moyens de nous contacter',
      email: 'E-mail',
      response: 'Temps de réponse',
      responseText: 'Généralement dans les 24 heures',
      social: 'Réseaux sociaux'
    }
  }
}

export default function ContactPage() {
  const { language, setLanguage } = useLanguage()
  const t = content[language] || content.en
  const h = headerTexts[language] || headerTexts.en
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" scroll={false} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold">M</div>
            <span className="text-lg sm:text-xl font-bold hidden sm:block">MediaToolkit</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" scroll={false} className="text-gray-400 hover:text-white transition text-sm">{h.home}</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">{h.dashboard}</Link>
            <div className="relative group">
              <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-gray-400 text-lg">{t.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.form.name}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.form.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.form.subject}</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="" className="bg-gray-900">--</option>
                    {t.subjects.map((s: string) => (
                      <option key={s} value={s} className="bg-gray-900">{s}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.form.message}</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>
                
                {status === 'success' && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                    ✅ {t.form.success}
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    ❌ {t.form.error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  {loading ? t.form.sending : t.form.submit}
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="font-semibold mb-4">{t.info.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{t.info.email}</div>
                    <a href="mailto:support@mediatoolkit.site" className="text-purple-400 hover:text-purple-300">
                      support@mediatoolkit.site
                    </a>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{t.info.response}</div>
                    <div className="text-white">{t.info.responseText}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">{t.info.social}</div>
                    <div className="flex gap-3">
                      <a href="https://twitter.com/mediatoolkit" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                        𝕏
                      </a>
                      <a href="https://instagram.com/mediatoolkit" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                        📷
                      </a>
                      <a href="https://tiktok.com/@mediatoolkit" target="_blank" rel="noopener" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                        🎵
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Link */}
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl text-center">
                <div className="text-2xl mb-2">❓</div>
                <h3 className="font-semibold mb-2">FAQ</h3>
                <p className="text-gray-400 text-sm mb-4">Check our frequently asked questions</p>
                <a href="/faq" className="inline-flex px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition">
                  View FAQ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
