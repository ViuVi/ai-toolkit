'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Hashtag Generator', subtitle: 'Generate trending hashtags', free: '💫 FREE', topic: 'Topic', placeholder: 'e.g. fitness, travel...', platform: 'Platform', generate: 'Generate Hashtags', generating: 'Generating...', results: 'Generated Hashtags', copyAll: 'Copy All', copied: 'Copied!', required: 'Topic is required', success: 'Hashtags generated!', error: 'An error occurred', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok', linkedin: 'LinkedIn' } },
  tr: { back: '← Panele Dön', title: 'Hashtag Üretici', subtitle: 'Trend hashtagler oluştur', free: '💫 ÜCRETSİZ', topic: 'Konu', placeholder: 'örn. fitness, seyahat...', platform: 'Platform', generate: 'Hashtag Oluştur', generating: 'Oluşturuluyor...', results: 'Oluşturulan Hashtagler', copyAll: 'Tümünü Kopyala', copied: 'Kopyalandı!', required: 'Konu gerekli', success: 'Hashtagler oluşturuldu!', error: 'Hata', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok', linkedin: 'LinkedIn' } },
  ru: { back: '← Назад', title: 'Генератор хэштегов', subtitle: 'Создайте трендовые хэштеги', free: '💫 БЕСПЛАТНО', topic: 'Тема', placeholder: 'напр. фитнес, путешествия...', platform: 'Платформа', generate: 'Создать хэштеги', generating: 'Создание...', results: 'Созданные хэштеги', copyAll: 'Копировать все', copied: 'Скопировано!', required: 'Тема обязательна', success: 'Хэштеги созданы!', error: 'Ошибка', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok', linkedin: 'LinkedIn' } },
  de: { back: '← Zurück', title: 'Hashtag-Generator', subtitle: 'Trendige Hashtags generieren', free: '💫 KOSTENLOS', topic: 'Thema', placeholder: 'z.B. Fitness, Reisen...', platform: 'Plattform', generate: 'Hashtags erstellen', generating: 'Erstellen...', results: 'Erstellte Hashtags', copyAll: 'Alle kopieren', copied: 'Kopiert!', required: 'Thema erforderlich', success: 'Hashtags erstellt!', error: 'Fehler', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok', linkedin: 'LinkedIn' } },
  fr: { back: '← Retour', title: 'Générateur de hashtags', subtitle: 'Générez des hashtags tendance', free: '💫 GRATUIT', topic: 'Sujet', placeholder: 'ex. fitness, voyage...', platform: 'Plateforme', generate: 'Générer des hashtags', generating: 'Génération...', results: 'Hashtags générés', copyAll: 'Copier tout', copied: 'Copié!', required: 'Sujet requis', success: 'Hashtags générés!', error: 'Erreur', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok', linkedin: 'LinkedIn' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function HashtagGeneratorPage() {
  const [topic, setTopic] = useState(''); const [platform, setPlatform] = useState('instagram'); const [hashtags, setHashtags] = useState<string[]>([]); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]

  const handleGenerate = async () => {
    if (!topic) { showToast(t.required, 'warning'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/hashtag-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, language }) })
      const data = await res.json()
      if (data.hashtags) { setHashtags(data.hashtags); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const copyAll = () => { navigator.clipboard.writeText(hashtags.join(' ')); showToast(t.copied, 'success') }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div>
            <span className="text-2xl">#️⃣</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mb-4">{t.free}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium mb-2">{t.topic}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.placeholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {hashtags.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{t.results}</h2><button onClick={copyAll} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition">{t.copyAll}</button></div>
            <div className="flex flex-wrap gap-2">{hashtags.map((tag, i) => (<span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm">{tag}</span>))}</div>
          </div>
        )}
      </main>
    </div>
  )
}
