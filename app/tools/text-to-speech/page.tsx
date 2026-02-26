'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Text to Speech', subtitle: 'Convert text to speech', credits: '3 Credits', new: '✨ NEW', text: 'Text', placeholder: 'Enter text to convert...', voice: 'Voice', generate: 'Generate Audio', generating: 'Generating...', download: 'Download', required: 'Text is required', success: 'Done!', error: 'Error', voices: { female: 'Female', male: 'Male' } },
  tr: { back: '← Panele Dön', title: 'Seslendirme', subtitle: 'Metni sese dönüştür', credits: '3 Kredi', new: '✨ YENİ', text: 'Metin', placeholder: 'Dönüştürülecek metni girin...', voice: 'Ses', generate: 'Ses Oluştur', generating: 'Oluşturuluyor...', download: 'İndir', required: 'Metin gerekli', success: 'Tamam!', error: 'Hata', voices: { female: 'Kadın', male: 'Erkek' } },
  ru: { back: '← Назад', title: 'Озвучка текста', subtitle: 'Преобразуйте текст в речь', credits: '3 Кредита', new: '✨ НОВОЕ', text: 'Текст', placeholder: 'Введите текст...', voice: 'Голос', generate: 'Создать аудио', generating: 'Создание...', download: 'Скачать', required: 'Текст обязателен', success: 'Готово!', error: 'Ошибка', voices: { female: 'Женский', male: 'Мужской' } },
  de: { back: '← Zurück', title: 'Text zu Sprache', subtitle: 'Text in Sprache umwandeln', credits: '3 Credits', new: '✨ NEU', text: 'Text', placeholder: 'Text eingeben...', voice: 'Stimme', generate: 'Audio erstellen', generating: 'Erstellen...', download: 'Herunterladen', required: 'Text erforderlich', success: 'Fertig!', error: 'Fehler', voices: { female: 'Weiblich', male: 'Männlich' } },
  fr: { back: '← Retour', title: 'Synthèse vocale', subtitle: 'Convertissez le texte en parole', credits: '3 Crédits', new: '✨ NOUVEAU', text: 'Texte', placeholder: 'Entrez le texte...', voice: 'Voix', generate: 'Générer audio', generating: 'Génération...', download: 'Télécharger', required: 'Texte requis', success: 'Terminé!', error: 'Erreur', voices: { female: 'Féminine', male: 'Masculine' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [text, setText] = useState(''); const [voice, setVoice] = useState('female'); const [audioUrl, setAudioUrl] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!text) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/text-to-speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice, language }) }); const data = await res.json(); if (data.audioUrl) { setAudioUrl(data.audioUrl); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">🔊</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">{t.new} ⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.text}</label><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl resize-none" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.voice}</label><select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.voices).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {audioUrl && (<div className="bg-gray-800 rounded-2xl p-6 text-center"><audio controls src={audioUrl} className="w-full mb-4" /><a href={audioUrl} download className="px-6 py-3 bg-purple-600 rounded-xl font-semibold inline-block">{t.download}</a></div>)}
      </main>
    </div>
  )
}
