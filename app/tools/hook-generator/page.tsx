'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Hook Generator', subtitle: 'Create attention-grabbing opening hooks', credits: '2 Credits',
    topicLabel: 'Topic/Subject', topicPlaceholder: 'What is your content about?',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    hookTypeLabel: 'Hook Style', hookTypes: { question: 'Question', shocking: 'Shocking Statement', story: 'Story Opening', curiosity: 'Curiosity Gap' },
    countLabel: 'Number of Hooks',
    generate: 'Generate Hooks', generating: 'Creating hooks...',
    results: 'Your Hooks', copy: 'Copy', copied: 'Copied!',
    emptyInput: 'Please enter a topic', success: 'Hooks generated!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Hook Üretici', subtitle: 'Dikkat çeken açılış hooklarını oluşturun', credits: '2 Kredi',
    topicLabel: 'Konu', topicPlaceholder: 'İçeriğiniz ne hakkında?',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    hookTypeLabel: 'Hook Stili', hookTypes: { question: 'Soru', shocking: 'Şok Edici', story: 'Hikaye Açılışı', curiosity: 'Merak Uyandırıcı' },
    countLabel: 'Hook Sayısı',
    generate: 'Hook Oluştur', generating: 'Hooklar oluşturuluyor...',
    results: 'Hooklarınız', copy: 'Kopyala', copied: 'Kopyalandı!',
    emptyInput: 'Lütfen konu girin', success: 'Hooklar oluşturuldu!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Генератор хуков', subtitle: 'Создавайте привлекающие внимание хуки', credits: '2 кредита', topicLabel: 'Тема', topicPlaceholder: 'О чём ваш контент?', platformLabel: 'Платформа', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, hookTypeLabel: 'Стиль', hookTypes: { question: 'Вопрос', shocking: 'Шокирующий', story: 'История', curiosity: 'Интрига' }, countLabel: 'Количество', generate: 'Создать', generating: 'Создание...', results: 'Ваши хуки', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Hook-Generator', subtitle: 'Erstellen Sie aufmerksamkeitsstarke Hooks', credits: '2 Credits', topicLabel: 'Thema', topicPlaceholder: 'Worum geht es?', platformLabel: 'Plattform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, hookTypeLabel: 'Stil', hookTypes: { question: 'Frage', shocking: 'Schockierend', story: 'Geschichte', curiosity: 'Neugier' }, countLabel: 'Anzahl', generate: 'Erstellen', generating: 'Wird erstellt...', results: 'Ihre Hooks', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de hooks', subtitle: 'Créez des hooks accrocheurs', credits: '2 crédits', topicLabel: 'Sujet', topicPlaceholder: 'De quoi parle votre contenu?', platformLabel: 'Plateforme', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, hookTypeLabel: 'Style', hookTypes: { question: 'Question', shocking: 'Choquant', story: 'Histoire', curiosity: 'Curiosité' }, countLabel: 'Nombre', generate: 'Créer', generating: 'Création...', results: 'Vos hooks', copy: 'Copier', copied: 'Copié!', emptyInput: 'Entrez un sujet', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [hookType, setHookType] = useState('question')
  const [count, setCount] = useState(5)
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/hook-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, hookType, count, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.hooks); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text); setCopiedId(id)
    showToast(t.copied, 'success'); setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-700 transition">
                <span>🌐</span><span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">🎣</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.hookTypeLabel}</label>
              <select value={hookType} onChange={(e) => setHookType(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.hookTypes).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.countLabel}</label>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {[3, 5, 7, 10].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🎣</span>{t.generate}</>)}
        </button>

        {result.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>✨</span>{t.results}</h2>
            <div className="space-y-3">
              {result.map((hook, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{hook.id}</span>
                    <p className="text-gray-200 leading-relaxed">{hook.hook}</p>
                  </div>
                  <button onClick={() => handleCopy(hook.hook, hook.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex-shrink-0 ${copiedId === hook.id ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    {copiedId === hook.id ? t.copied : t.copy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
