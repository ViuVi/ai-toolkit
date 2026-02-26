'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Video Script Writer', subtitle: 'Create scripts for your videos', credits: '4 Credits', topic: 'Topic', placeholder: 'What is your video about?', platform: 'Platform', duration: 'Duration', generate: 'Generate Script', generating: 'Generating...', result: 'Generated Script', copy: 'Copy', copied: 'Copied!', required: 'Topic is required', success: 'Script generated!', error: 'Error', platforms: { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram Reels', shorts: 'YouTube Shorts' }, durations: { short: '30 seconds', medium: '1 minute', long: '3 minutes', verylong: '5+ minutes' } },
  tr: { back: '← Panele Dön', title: 'Video Script Yazarı', subtitle: 'Videolarınız için script oluşturun', credits: '4 Kredi', topic: 'Konu', placeholder: 'Videonuz ne hakkında?', platform: 'Platform', duration: 'Süre', generate: 'Script Oluştur', generating: 'Oluşturuluyor...', result: 'Oluşturulan Script', copy: 'Kopyala', copied: 'Kopyalandı!', required: 'Konu gerekli', success: 'Script oluşturuldu!', error: 'Hata', platforms: { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram Reels', shorts: 'YouTube Shorts' }, durations: { short: '30 saniye', medium: '1 dakika', long: '3 dakika', verylong: '5+ dakika' } },
  ru: { back: '← Назад', title: 'Сценарист видео', subtitle: 'Создайте сценарии для видео', credits: '4 Кредита', topic: 'Тема', placeholder: 'О чем ваше видео?', platform: 'Платформа', duration: 'Длительность', generate: 'Создать сценарий', generating: 'Создание...', result: 'Созданный сценарий', copy: 'Копировать', copied: 'Скопировано!', required: 'Тема обязательна', success: 'Сценарий создан!', error: 'Ошибка', platforms: { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram Reels', shorts: 'YouTube Shorts' }, durations: { short: '30 секунд', medium: '1 минута', long: '3 минуты', verylong: '5+ минут' } },
  de: { back: '← Zurück', title: 'Video-Skript-Autor', subtitle: 'Erstellen Sie Skripte für Videos', credits: '4 Credits', topic: 'Thema', placeholder: 'Worum geht es?', platform: 'Plattform', duration: 'Dauer', generate: 'Skript erstellen', generating: 'Erstellen...', result: 'Erstelltes Skript', copy: 'Kopieren', copied: 'Kopiert!', required: 'Thema erforderlich', success: 'Skript erstellt!', error: 'Fehler', platforms: { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram Reels', shorts: 'YouTube Shorts' }, durations: { short: '30 Sekunden', medium: '1 Minute', long: '3 Minuten', verylong: '5+ Minuten' } },
  fr: { back: '← Retour', title: 'Scénariste vidéo', subtitle: 'Créez des scripts pour vos vidéos', credits: '4 Crédits', topic: 'Sujet', placeholder: 'De quoi parle votre vidéo?', platform: 'Plateforme', duration: 'Durée', generate: 'Générer le script', generating: 'Génération...', result: 'Script généré', copy: 'Copier', copied: 'Copié!', required: 'Sujet requis', success: 'Script généré!', error: 'Erreur', platforms: { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram Reels', shorts: 'YouTube Shorts' }, durations: { short: '30 secondes', medium: '1 minute', long: '3 minutes', verylong: '5+ minutes' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function VideoScriptPage() {
  const [topic, setTopic] = useState(''); const [platform, setPlatform] = useState('youtube'); const [duration, setDuration] = useState('medium'); const [script, setScript] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!topic) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/video-script', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, duration, language }) }); const data = await res.json(); if (data.script) { setScript(data.script); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">🎬</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-2">{t.topic}</label><textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.placeholder} rows={3} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-2">{t.duration}</label><select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.durations).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
            </div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {script && (<div className="bg-gray-800 rounded-2xl p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={() => {navigator.clipboard.writeText(script); showToast(t.copied, 'success')}} className="px-4 py-2 bg-purple-600 rounded-lg text-sm">{t.copy}</button></div><pre className="whitespace-pre-wrap text-gray-300">{script}</pre></div>)}
      </main>
    </div>
  )
}
