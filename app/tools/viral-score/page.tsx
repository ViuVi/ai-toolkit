'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Viral Score', subtitle: 'Check if your content has viral potential', credits: '3 Credits', contentLabel: 'Content', contentPlaceholder: 'Enter your content...', platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, check: 'Check Score', checking: 'Analyzing...', score: 'Viral Score', factors: 'Viral Factors', improvements: 'Improvements', words: 'words', emptyInput: 'Enter content', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Viral Skoru', subtitle: 'İçeriğinizin viral potansiyelini kontrol edin', credits: '3 Kredi', contentLabel: 'İçerik', contentPlaceholder: 'İçeriğinizi girin...', platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, check: 'Skor Kontrol', checking: 'Analiz ediliyor...', score: 'Viral Skoru', factors: 'Viral Faktörler', improvements: 'İyileştirmeler', words: 'kelime', emptyInput: 'İçerik girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Вирусный рейтинг', subtitle: 'Проверьте вирусный потенциал', credits: '3 кредита', contentLabel: 'Контент', contentPlaceholder: 'Введите контент...', platformLabel: 'Платформа', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, check: 'Проверить', checking: 'Анализ...', score: 'Рейтинг', factors: 'Факторы', improvements: 'Улучшения', words: 'слов', emptyInput: 'Введите контент', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Viral-Score', subtitle: 'Virales Potenzial prüfen', credits: '3 Credits', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt eingeben...', platformLabel: 'Plattform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, check: 'Prüfen', checking: 'Analyse...', score: 'Score', factors: 'Faktoren', improvements: 'Verbesserungen', words: 'Wörter', emptyInput: 'Inhalt eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Score viral', subtitle: 'Vérifiez le potentiel viral', credits: '3 crédits', contentLabel: 'Contenu', contentPlaceholder: 'Entrez contenu...', platformLabel: 'Plateforme', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, check: 'Vérifier', checking: 'Analyse...', score: 'Score', factors: 'Facteurs', improvements: 'Améliorations', words: 'mots', emptyInput: 'Entrez contenu', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function ViralScorePage() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleCheck = async () => {
    if (!content.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/viral-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 70 ? 'from-green-500 to-emerald-500' : score >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🚀</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contentLabel}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /><p className="text-xs text-gray-500 mt-1">{content.split(/\s+/).filter(Boolean).length} {t.words}</p></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
        </div>
        <button onClick={handleCheck} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.checking}</>) : (<><span>🚀</span>{t.check}</>)}</button>
        {result && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${getScoreColor(result.viralScore)} rounded-2xl p-8 text-center`}><h2 className="text-lg text-white/80 mb-2">{t.score}</h2><p className="text-6xl font-bold text-white">{result.viralScore}<span className="text-2xl">/100</span></p></div>
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.factors}</h2><div className="space-y-3">{result.factors?.map((f: any, i: number) => (<div key={i} className="flex items-center gap-3"><span className="text-xl">{f.present ? '✅' : f.partial ? '⚠️' : '❌'}</span><span className={f.present ? 'text-green-400' : f.partial ? 'text-yellow-400' : 'text-gray-400'}>{f.factor}</span></div>))}</div></div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6"><h2 className="text-xl font-semibold mb-4">{t.improvements}</h2><ul className="space-y-3">{result.improvements?.map((imp: string, i: number) => (<li key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-3"><span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span><span>{imp}</span></li>))}</ul></div>
          </div>
        )}
      </main>
    </div>
  )
}
