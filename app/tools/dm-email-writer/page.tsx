'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'DM & Email Writer', subtitle: 'Create professional messages for collaborations, sales, and networking', credits: '2 Credits',
    typeLabel: 'Message Type', types: { dm: '💬 DM / Direct Message', email: '📧 Email' },
    purposeLabel: 'Purpose', purposes: { collaboration: '🤝 Collaboration Request', networking: '🔗 Networking', customer: '💁 Customer Service', sales: '💼 Sales Pitch', followup: '📩 Follow-up', thankyou: '🙏 Thank You' },
    recipientLabel: 'Recipient', recipientPlaceholder: 'Who are you writing to? (brand, influencer, client...)',
    contextLabel: 'Details', contextPlaceholder: 'What do you want to say? Any specific details...',
    toneLabel: 'Tone', tones: { professional: 'Professional', friendly: 'Friendly', casual: 'Casual' },
    generate: 'Generate Messages', generating: 'AI writing messages...',
    results: 'Message Options', subject: 'Subject', approach: 'Approach', copy: 'Copy', copied: 'Copied!',
    emptyInput: 'Select a purpose', success: 'Messages generated!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'DM & E-posta Yazarı', subtitle: 'İşbirlikleri, satış ve networking için profesyonel mesajlar oluşturun', credits: '2 Kredi',
    typeLabel: 'Mesaj Tipi', types: { dm: '💬 DM / Direkt Mesaj', email: '📧 E-posta' },
    purposeLabel: 'Amaç', purposes: { collaboration: '🤝 İşbirliği Teklifi', networking: '🔗 Networking', customer: '💁 Müşteri Hizmetleri', sales: '💼 Satış', followup: '📩 Takip Mesajı', thankyou: '🙏 Teşekkür' },
    recipientLabel: 'Alıcı', recipientPlaceholder: 'Kime yazıyorsunuz? (marka, influencer, müşteri...)',
    contextLabel: 'Detaylar', contextPlaceholder: 'Ne söylemek istiyorsunuz? Özel detaylar...',
    toneLabel: 'Ton', tones: { professional: 'Profesyonel', friendly: 'Samimi', casual: 'Rahat' },
    generate: 'Mesaj Oluştur', generating: 'AI mesaj yazıyor...',
    results: 'Mesaj Seçenekleri', subject: 'Konu', approach: 'Yaklaşım', copy: 'Kopyala', copied: 'Kopyalandı!',
    emptyInput: 'Amaç seçin', success: 'Mesajlar oluşturuldu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'DM & Email', subtitle: 'Создавайте профессиональные сообщения', credits: '2 кредита', typeLabel: 'Тип', types: { dm: '💬 DM', email: '📧 Email' }, purposeLabel: 'Цель', purposes: { collaboration: '🤝 Сотрудничество', networking: '🔗 Нетворкинг', customer: '💁 Клиенты', sales: '💼 Продажи', followup: '📩 Фоллоу-ап', thankyou: '🙏 Благодарность' }, recipientLabel: 'Получатель', recipientPlaceholder: 'Кому...', contextLabel: 'Детали', contextPlaceholder: 'Что сказать...', toneLabel: 'Тон', tones: { professional: 'Профессиональный', friendly: 'Дружелюбный', casual: 'Обычный' }, generate: 'Создать', generating: 'Создание...', results: 'Варианты', subject: 'Тема', approach: 'Подход', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Выберите цель', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'DM & E-Mail', subtitle: 'Professionelle Nachrichten erstellen', credits: '2 Credits', typeLabel: 'Typ', types: { dm: '💬 DM', email: '📧 E-Mail' }, purposeLabel: 'Zweck', purposes: { collaboration: '🤝 Zusammenarbeit', networking: '🔗 Networking', customer: '💁 Kundenservice', sales: '💼 Verkauf', followup: '📩 Follow-up', thankyou: '🙏 Danke' }, recipientLabel: 'Empfänger', recipientPlaceholder: 'An wen...', contextLabel: 'Details', contextPlaceholder: 'Was sagen...', toneLabel: 'Ton', tones: { professional: 'Professionell', friendly: 'Freundlich', casual: 'Locker' }, generate: 'Erstellen', generating: 'Erstelle...', results: 'Optionen', subject: 'Betreff', approach: 'Ansatz', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Zweck wählen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'DM & Email', subtitle: 'Créez des messages professionnels', credits: '2 crédits', typeLabel: 'Type', types: { dm: '💬 DM', email: '📧 Email' }, purposeLabel: 'But', purposes: { collaboration: '🤝 Collaboration', networking: '🔗 Networking', customer: '💁 Service client', sales: '💼 Vente', followup: '📩 Suivi', thankyou: '🙏 Merci' }, recipientLabel: 'Destinataire', recipientPlaceholder: 'À qui...', contextLabel: 'Détails', contextPlaceholder: 'Quoi dire...', toneLabel: 'Ton', tones: { professional: 'Professionnel', friendly: 'Amical', casual: 'Décontracté' }, generate: 'Créer', generating: 'Création...', results: 'Options', subject: 'Sujet', approach: 'Approche', copy: 'Copier', copied: 'Copié!', emptyInput: 'Choisir but', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function DMEmailWriterPage() {
  const [messageType, setMessageType] = useState('dm')
  const [purpose, setPurpose] = useState('collaboration')
  const [recipient, setRecipient] = useState('')
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('professional')
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/dm-email-writer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purpose, recipient, context, tone, messageType, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.messages); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: number) => {
    const fullText = result.find(m => m.id === id)
    const copyText = fullText?.subject ? `${fullText.subject}\n\n${text}` : text
    navigator.clipboard.writeText(copyText)
    setCopiedId(id)
    showToast(t.copied, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">✉️</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.typeLabel}</label><div className="flex gap-3">{Object.entries(t.types).map(([k, v]) => (<button key={k} onClick={() => setMessageType(k)} className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${messageType === k ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{v as string}</button>))}</div></div>
          
          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.purposeLabel}</label><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{Object.entries(t.purposes).map(([k, v]) => (<button key={k} onClick={() => setPurpose(k)} className={`px-3 py-2 rounded-xl text-sm font-medium transition ${purpose === k ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{v as string}</button>))}</div></div>

          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.recipientLabel}</label><input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder={t.recipientPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>

          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contextLabel}</label><textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder={t.contextPlaceholder} className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>

          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label><div className="flex gap-2">{Object.entries(t.tones).map(([k, v]) => (<button key={k} onClick={() => setTone(k)} className={`px-4 py-2 rounded-xl font-medium transition ${tone === k ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{v as string}</button>))}</div></div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>✉️</span>{t.generate}</>)}</button>

        {result.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><span>📝</span>{t.results}</h2>
            {result.map((msg, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 hover:border-purple-500/50 transition">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">{t.approach}: {msg.approach}</span>
                  <button onClick={() => handleCopy(msg.message, msg.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${copiedId === msg.id ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === msg.id ? t.copied : t.copy}</button>
                </div>
                {msg.subject && (<div className="mb-3 pb-3 border-b border-gray-700"><span className="text-sm text-gray-400">{t.subject}:</span><p className="font-semibold text-purple-400">{msg.subject}</p></div>)}
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
