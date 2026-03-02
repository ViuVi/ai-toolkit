'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Thread Writer', subtitle: 'Create viral Twitter/X threads that get engagement', credits: '4 Credits',
    topicLabel: 'Thread Topic', topicPlaceholder: 'What is your thread about?',
    lengthLabel: 'Thread Length', lengths: { '5': '5 tweets', '7': '7 tweets', '10': '10 tweets', '15': '15 tweets' },
    styleLabel: 'Style', styles: { educational: '📚 Educational', storytelling: '📖 Storytelling', listicle: '📋 Listicle', controversial: '🔥 Controversial' },
    platformLabel: 'Platform', platforms: { twitter: 'Twitter/X (280 chars)', threads: 'Threads (500 chars)' },
    generate: 'Generate Thread', generating: 'AI writing thread...',
    results: 'Your Thread', hook: 'HOOK', content: 'CONTENT', cta: 'CTA',
    copyAll: 'Copy All', copyTweet: 'Copy', copied: 'Copied!', chars: 'chars',
    emptyInput: 'Enter your topic', success: 'Thread generated!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Thread Yazarı', subtitle: 'Etkileşim alan viral Twitter/X thread\'leri oluşturun', credits: '4 Kredi',
    topicLabel: 'Thread Konusu', topicPlaceholder: 'Thread\'iniz ne hakkında?',
    lengthLabel: 'Thread Uzunluğu', lengths: { '5': '5 tweet', '7': '7 tweet', '10': '10 tweet', '15': '15 tweet' },
    styleLabel: 'Stil', styles: { educational: '📚 Eğitici', storytelling: '📖 Hikaye', listicle: '📋 Liste', controversial: '🔥 Tartışmalı' },
    platformLabel: 'Platform', platforms: { twitter: 'Twitter/X (280 karakter)', threads: 'Threads (500 karakter)' },
    generate: 'Thread Oluştur', generating: 'AI thread yazıyor...',
    results: 'Thread\'iniz', hook: 'HOOK', content: 'İÇERİK', cta: 'CTA',
    copyAll: 'Tümünü Kopyala', copyTweet: 'Kopyala', copied: 'Kopyalandı!', chars: 'karakter',
    emptyInput: 'Konunuzu girin', success: 'Thread oluşturuldu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Автор тредов', subtitle: 'Создавайте вирусные треды', credits: '4 кредита', topicLabel: 'Тема', topicPlaceholder: 'О чём тред?', lengthLabel: 'Длина', lengths: { '5': '5 твитов', '7': '7 твитов', '10': '10 твитов', '15': '15 твитов' }, styleLabel: 'Стиль', styles: { educational: '📚 Образовательный', storytelling: '📖 История', listicle: '📋 Список', controversial: '🔥 Спорный' }, platformLabel: 'Платформа', platforms: { twitter: 'Twitter/X', threads: 'Threads' }, generate: 'Создать', generating: 'Создание...', results: 'Тред', hook: 'ХУК', content: 'КОНТЕНТ', cta: 'CTA', copyAll: 'Копировать всё', copyTweet: 'Копировать', copied: 'Скопировано!', chars: 'символов', emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Thread-Schreiber', subtitle: 'Erstellen Sie virale Threads', credits: '4 Credits', topicLabel: 'Thema', topicPlaceholder: 'Worüber ist der Thread?', lengthLabel: 'Länge', lengths: { '5': '5 Tweets', '7': '7 Tweets', '10': '10 Tweets', '15': '15 Tweets' }, styleLabel: 'Stil', styles: { educational: '📚 Bildend', storytelling: '📖 Geschichte', listicle: '📋 Liste', controversial: '🔥 Kontrovers' }, platformLabel: 'Plattform', platforms: { twitter: 'Twitter/X', threads: 'Threads' }, generate: 'Erstellen', generating: 'Erstelle...', results: 'Thread', hook: 'HOOK', content: 'INHALT', cta: 'CTA', copyAll: 'Alles kopieren', copyTweet: 'Kopieren', copied: 'Kopiert!', chars: 'Zeichen', emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Rédacteur de threads', subtitle: 'Créez des threads viraux', credits: '4 crédits', topicLabel: 'Sujet', topicPlaceholder: 'De quoi parle le thread?', lengthLabel: 'Longueur', lengths: { '5': '5 tweets', '7': '7 tweets', '10': '10 tweets', '15': '15 tweets' }, styleLabel: 'Style', styles: { educational: '📚 Éducatif', storytelling: '📖 Histoire', listicle: '📋 Liste', controversial: '🔥 Controversé' }, platformLabel: 'Plateforme', platforms: { twitter: 'Twitter/X', threads: 'Threads' }, generate: 'Créer', generating: 'Création...', results: 'Thread', hook: 'ACCROCHE', content: 'CONTENU', cta: 'CTA', copyAll: 'Tout copier', copyTweet: 'Copier', copied: 'Copié!', chars: 'caractères', emptyInput: 'Entrez sujet', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function ThreadWriterPage() {
  const [topic, setTopic] = useState('')
  const [threadLength, setThreadLength] = useState('7')
  const [style, setStyle] = useState('educational')
  const [platform, setPlatform] = useState('twitter')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/thread-writer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, threadLength: parseInt(threadLength), style, platform, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast(t.copied, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyAll = () => {
    if (!result?.thread) return
    const allText = result.thread.map((tw: any) => tw.content).join('\n\n---\n\n')
    navigator.clipboard.writeText(allText)
    setCopiedId('all')
    showToast(t.copied, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getTypeLabel = (type: string) => {
    if (type === 'hook') return t.hook
    if (type === 'cta') return t.cta
    return t.content
  }

  const getTypeColor = (type: string) => {
    if (type === 'hook') return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    if (type === 'cta') return 'bg-green-500/20 text-green-400 border-green-500/30'
    return 'bg-gray-700/50 text-gray-300 border-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🧵</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel} *</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.lengthLabel}</label><select value={threadLength} onChange={(e) => setThreadLength(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.lengths).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>

          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.styleLabel}</label><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{Object.entries(t.styles).map(([k, v]) => (<button key={k} onClick={() => setStyle(k)} className={`px-3 py-2 rounded-xl text-sm font-medium transition ${style === k ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{v as string}</button>))}</div></div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🧵</span>{t.generate}</>)}</button>

        {result?.thread && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2"><span>📝</span>{t.results}</h2>
              <button onClick={handleCopyAll} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${copiedId === 'all' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === 'all' ? t.copied : t.copyAll}</button>
            </div>
            
            <div className="space-y-3">
              {result.thread.map((tweet: any, i: number) => (
                <div key={i} className={`rounded-2xl border p-5 ${getTypeColor(tweet.type)}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{tweet.number}</span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs font-medium">{getTypeLabel(tweet.type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{tweet.content.length} {t.chars}</span>
                      <button onClick={() => handleCopy(tweet.content, tweet.number)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${copiedId === tweet.number ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === tweet.number ? t.copied : t.copyTweet}</button>
                    </div>
                  </div>
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{tweet.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
