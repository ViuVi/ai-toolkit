'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: {
    back: 'Geri',
    title: 'İletişim',
    subtitle: 'Bir sorunuz veya geri bildiriminiz mi var? Sizden haber almak isteriz.',
    name: 'İsim',
    namePlaceholder: 'Adınız',
    email: 'E-posta',
    emailPlaceholder: 'ornek@email.com',
    subject: 'Konu',
    subjects: ['Genel Soru', 'Teknik Destek', 'Ödeme Sorusu', 'Geri Bildirim', 'İş Birliği'],
    message: 'Mesaj',
    messagePlaceholder: 'Size nasıl yardımcı olabiliriz?',
    send: 'Mesaj Gönder',
    sending: 'Gönderiliyor...',
    successTitle: 'Mesaj Gönderildi!',
    successText: 'İletişime geçtiğiniz için teşekkürler. 24-48 saat içinde size dönüş yapacağız.',
    sendAnother: 'Başka Mesaj Gönder',
    backHome: 'Ana Sayfaya Dön',
    responseTime: 'Yanıt Süresi',
    responseText: 'Genellikle 1-2 iş günü içinde yanıt veriyoruz',
    error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
  },
  en: {
    back: 'Back',
    title: 'Contact Us',
    subtitle: 'Have a question or feedback? We\'d love to hear from you.',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    subject: 'Subject',
    subjects: ['General Inquiry', 'Technical Support', 'Billing Question', 'Feedback', 'Partnership'],
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    send: 'Send Message',
    sending: 'Sending...',
    successTitle: 'Message Sent!',
    successText: 'Thank you for reaching out. We\'ll get back to you within 24-48 hours.',
    sendAnother: 'Send Another',
    backHome: 'Back to Home',
    responseTime: 'Response Time',
    responseText: 'We typically respond within 1-2 business days',
    error: 'Failed to send message. Please try again.'
  },
  ru: {
    back: 'Назад',
    title: 'Связаться с нами',
    subtitle: 'Есть вопрос или отзыв? Мы будем рады услышать вас.',
    name: 'Имя',
    namePlaceholder: 'Ваше имя',
    email: 'Email',
    emailPlaceholder: 'вы@example.com',
    subject: 'Тема',
    subjects: ['Общий вопрос', 'Техподдержка', 'Вопрос об оплате', 'Отзыв', 'Партнерство'],
    message: 'Сообщение',
    messagePlaceholder: 'Чем мы можем помочь?',
    send: 'Отправить',
    sending: 'Отправка...',
    successTitle: 'Сообщение отправлено!',
    successText: 'Спасибо за обращение. Мы ответим в течение 24-48 часов.',
    sendAnother: 'Отправить еще',
    backHome: 'На главную',
    responseTime: 'Время ответа',
    responseText: 'Обычно отвечаем в течение 1-2 рабочих дней',
    error: 'Не удалось отправить. Попробуйте снова.'
  },
  de: {
    back: 'Zurück',
    title: 'Kontakt',
    subtitle: 'Haben Sie eine Frage oder Feedback? Wir freuen uns von Ihnen zu hören.',
    name: 'Name',
    namePlaceholder: 'Ihr Name',
    email: 'E-Mail',
    emailPlaceholder: 'sie@beispiel.de',
    subject: 'Betreff',
    subjects: ['Allgemeine Anfrage', 'Technischer Support', 'Zahlungsfrage', 'Feedback', 'Partnerschaft'],
    message: 'Nachricht',
    messagePlaceholder: 'Wie können wir helfen?',
    send: 'Nachricht senden',
    sending: 'Wird gesendet...',
    successTitle: 'Nachricht gesendet!',
    successText: 'Danke für Ihre Nachricht. Wir antworten innerhalb von 24-48 Stunden.',
    sendAnother: 'Weitere senden',
    backHome: 'Zur Startseite',
    responseTime: 'Antwortzeit',
    responseText: 'Wir antworten normalerweise innerhalb von 1-2 Werktagen',
    error: 'Senden fehlgeschlagen. Bitte erneut versuchen.'
  },
  fr: {
    back: 'Retour',
    title: 'Contactez-nous',
    subtitle: 'Vous avez une question ou un commentaire? Nous serions ravis de vous entendre.',
    name: 'Nom',
    namePlaceholder: 'Votre nom',
    email: 'Email',
    emailPlaceholder: 'vous@exemple.com',
    subject: 'Sujet',
    subjects: ['Question générale', 'Support technique', 'Question de facturation', 'Commentaire', 'Partenariat'],
    message: 'Message',
    messagePlaceholder: 'Comment pouvons-nous vous aider?',
    send: 'Envoyer',
    sending: 'Envoi...',
    successTitle: 'Message envoyé!',
    successText: 'Merci de nous avoir contactés. Nous vous répondrons dans les 24-48 heures.',
    sendAnother: 'Envoyer un autre',
    backHome: 'Retour à l\'accueil',
    responseTime: 'Temps de réponse',
    responseText: 'Nous répondons généralement sous 1-2 jours ouvrables',
    error: 'Échec de l\'envoi. Veuillez réessayer.'
  }
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: subject || t.subjects[0], message })
      })
      if (res.ok) {
        setSuccess(true)
        setName(''); setEmail(''); setMessage('')
      } else {
        setError(t.error)
      }
    } catch (err) {
      setError(t.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">M</div>
            <span className="font-bold">MediaToolkit</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition flex items-center gap-1">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition">← {t.back}</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.subtitle}</p>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold mb-2">{t.successTitle}</h2>
            <p className="text-gray-400 mb-6">{t.successText}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">{t.sendAnother}</button>
              <Link href="/" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">{t.backHome}</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.name}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" placeholder={t.namePlaceholder} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.email}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" placeholder={t.emailPlaceholder} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t.subject}</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition">
                {t.subjects.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t.message}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition resize-none" placeholder={t.messagePlaceholder} />
            </div>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.sending}</> : <>{t.send} 📧</>}
            </button>
          </form>
        )}

        <div className="mt-12 pt-12 border-t border-white/5">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4">
            <div className="text-3xl">⏰</div>
            <div>
              <h3 className="font-semibold">{t.responseTime}</h3>
              <p className="text-gray-400 text-sm">{t.responseText}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
