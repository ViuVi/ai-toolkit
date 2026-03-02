'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Comment Reply Generator', subtitle: 'Generate engaging, professional replies to comments instantly', credits: '2 Credits',
    commentLabel: 'Comment to Reply', commentPlaceholder: 'Paste the comment you want to reply to...',
    contextLabel: 'Context (Optional)', contextPlaceholder: 'Any additional context about your brand or the post...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    toneLabel: 'Tone', tones: { friendly: '😊 Friendly', professional: '💼 Professional', funny: '😄 Funny', grateful: '🙏 Grateful' },
    generate: 'Generate Replies', generating: 'AI creating replies...',
    results: 'Reply Options', style: 'Style', copy: 'Copy', copied: 'Copied!',
    emptyInput: 'Enter the comment to reply to', success: 'Replies generated!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Yorum Yanıtlayıcı', subtitle: 'Yorumlara anında profesyonel ve etkileyici yanıtlar oluşturun', credits: '2 Kredi',
    commentLabel: 'Yanıtlanacak Yorum', commentPlaceholder: 'Yanıtlamak istediğiniz yorumu yapıştırın...',
    contextLabel: 'Bağlam (Opsiyonel)', contextPlaceholder: 'Markanız veya gönderi hakkında ek bilgi...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    toneLabel: 'Ton', tones: { friendly: '😊 Samimi', professional: '💼 Profesyonel', funny: '😄 Eğlenceli', grateful: '🙏 Minnettarlık' },
    generate: 'Yanıt Oluştur', generating: 'AI yanıt oluşturuyor...',
    results: 'Yanıt Seçenekleri', style: 'Stil', copy: 'Kopyala', copied: 'Kopyalandı!',
    emptyInput: 'Yanıtlanacak yorumu girin', success: 'Yanıtlar oluşturuldu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Генератор ответов', subtitle: 'Создавайте ответы на комментарии', credits: '2 кредита', commentLabel: 'Комментарий', commentPlaceholder: 'Вставьте комментарий...', contextLabel: 'Контекст', contextPlaceholder: 'Дополнительная информация...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, toneLabel: 'Тон', tones: { friendly: '😊 Дружелюбный', professional: '💼 Профессиональный', funny: '😄 Весёлый', grateful: '🙏 Благодарный' }, generate: 'Создать', generating: 'Создание...', results: 'Варианты', style: 'Стиль', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Введите комментарий', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Antwort-Generator', subtitle: 'Erstellen Sie Antworten auf Kommentare', credits: '2 Credits', commentLabel: 'Kommentar', commentPlaceholder: 'Kommentar einfügen...', contextLabel: 'Kontext', contextPlaceholder: 'Zusätzliche Informationen...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, toneLabel: 'Ton', tones: { friendly: '😊 Freundlich', professional: '💼 Professionell', funny: '😄 Lustig', grateful: '🙏 Dankbar' }, generate: 'Erstellen', generating: 'Erstelle...', results: 'Optionen', style: 'Stil', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Kommentar eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de réponses', subtitle: 'Créez des réponses aux commentaires', credits: '2 crédits', commentLabel: 'Commentaire', commentPlaceholder: 'Collez le commentaire...', contextLabel: 'Contexte', contextPlaceholder: 'Informations supplémentaires...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, toneLabel: 'Ton', tones: { friendly: '😊 Amical', professional: '💼 Professionnel', funny: '😄 Drôle', grateful: '🙏 Reconnaissant' }, generate: 'Créer', generating: 'Création...', results: 'Options', style: 'Style', copy: 'Copier', copied: 'Copié!', emptyInput: 'Entrez commentaire', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function CommentReplyPage() {
  const [comment, setComment] = useState('')
  const [context, setContext] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('friendly')
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!comment.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/comment-reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, context, platform, tone, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.replies); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast(t.copied, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">💬</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.commentLabel} *</label><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t.commentPlaceholder} className="w-full h-28 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contextLabel}</label><input type="text" value={context} onChange={(e) => setContext(e.target.value)} placeholder={t.contextPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.tones).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>💬</span>{t.generate}</>)}</button>

        {result.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><span>✨</span>{t.results}</h2>
            {result.map((reply, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 hover:border-purple-500/50 transition">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">{t.style}: {reply.style}</span>
                  <button onClick={() => handleCopy(reply.reply, reply.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${copiedId === reply.id ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === reply.id ? t.copied : t.copy}</button>
                </div>
                <p className="text-gray-200 leading-relaxed">{reply.reply}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
