'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Content Idea Generator', subtitle: 'Get 10 unique, viral-worthy content ideas for your niche', credits: '3 Credits',
    nicheLabel: 'Your Niche / Topic', nichePlaceholder: 'e.g. fitness, cooking, tech reviews, fashion, travel...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    contentTypeLabel: 'Content Style', contentTypes: { educational: '📚 Educational', entertaining: '🎭 Entertaining', inspiring: '💫 Inspiring', behindscenes: '🎬 Behind Scenes', mixed: '🎯 Mixed' },
    audienceLabel: 'Target Audience (Optional)', audiencePlaceholder: 'e.g. beginners, professionals, Gen Z...',
    generate: 'Generate 10 Ideas', generating: 'AI brainstorming...',
    results: 'Your Content Ideas', format: 'Format', category: 'Category', hook: 'Hook',
    emptyInput: 'Enter your niche', success: 'Ideas generated!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'İçerik Fikir Motoru', subtitle: 'Nişiniz için 10 özgün, viral potansiyelli içerik fikri alın', credits: '3 Kredi',
    nicheLabel: 'Niş / Konu', nichePlaceholder: 'örn: fitness, yemek, teknoloji, moda, seyahat...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    contentTypeLabel: 'İçerik Stili', contentTypes: { educational: '📚 Eğitici', entertaining: '🎭 Eğlenceli', inspiring: '💫 İlham Verici', behindscenes: '🎬 Sahne Arkası', mixed: '🎯 Karışık' },
    audienceLabel: 'Hedef Kitle (Opsiyonel)', audiencePlaceholder: 'örn: yeni başlayanlar, profesyoneller, Z kuşağı...',
    generate: '10 Fikir Oluştur', generating: 'AI beyin fırtınası yapıyor...',
    results: 'İçerik Fikirleriniz', format: 'Format', category: 'Kategori', hook: 'Hook',
    emptyInput: 'Nişinizi girin', success: 'Fikirler oluşturuldu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Генератор идей', subtitle: 'Получите 10 уникальных идей', credits: '3 кредита', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, contentTypeLabel: 'Стиль', contentTypes: { educational: '📚 Образовательный', entertaining: '🎭 Развлекательный', inspiring: '💫 Вдохновляющий', behindscenes: '🎬 Закулисье', mixed: '🎯 Смешанный' }, audienceLabel: 'Аудитория', audiencePlaceholder: 'напр: новички...', generate: 'Создать', generating: 'Генерация...', results: 'Идеи', format: 'Формат', category: 'Категория', hook: 'Хук', emptyInput: 'Введите нишу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Ideen-Generator', subtitle: '10 einzigartige Ideen erhalten', credits: '3 Credits', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, contentTypeLabel: 'Stil', contentTypes: { educational: '📚 Bildend', entertaining: '🎭 Unterhaltend', inspiring: '💫 Inspirierend', behindscenes: '🎬 Behind Scenes', mixed: '🎯 Gemischt' }, audienceLabel: 'Zielgruppe', audiencePlaceholder: 'z.B. Anfänger...', generate: 'Erstellen', generating: 'Generiere...', results: 'Ideen', format: 'Format', category: 'Kategorie', hook: 'Hook', emptyInput: 'Nische eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur d\'idées', subtitle: 'Obtenez 10 idées uniques', credits: '3 crédits', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, contentTypeLabel: 'Style', contentTypes: { educational: '📚 Éducatif', entertaining: '🎭 Divertissant', inspiring: '💫 Inspirant', behindscenes: '🎬 Coulisses', mixed: '🎯 Mixte' }, audienceLabel: 'Audience', audiencePlaceholder: 'ex: débutants...', generate: 'Créer', generating: 'Génération...', results: 'Idées', format: 'Format', category: 'Catégorie', hook: 'Hook', emptyInput: 'Entrez niche', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function ContentIdeasPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [contentType, setContentType] = useState('mixed')
  const [targetAudience, setTargetAudience] = useState('')
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/content-ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, contentType, targetAudience, userId, language }) })
      const data = await res.json()
      if (data.error) { showToast(data.error, 'error'); setLoading(false); return }
      
      let ideas = data.ideas || []
      if (!Array.isArray(ideas)) ideas = []
      
      const normalizedIdeas = ideas.map((idea: any, i: number) => ({
        id: idea.id || i + 1,
        title: idea.title || idea.name || '',
        description: idea.description || idea.desc || '',
        format: idea.format || idea.type || '',
        category: idea.category || '',
        hook: idea.hook || '',
        difficulty: idea.difficulty || ''
      }))
      
      setResult(normalizedIdeas)
      if (normalizedIdeas.length > 0) showToast(t.success, 'success')
    } catch (err) { console.error('Ideas error:', err); showToast(t.error, 'error') }
    setLoading(false)
  }

  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase()
    if (lower.includes('eğiti') || lower.includes('educa')) return 'bg-blue-500/20 text-blue-400'
    if (lower.includes('eğlen') || lower.includes('entertain')) return 'bg-pink-500/20 text-pink-400'
    if (lower.includes('kişi') || lower.includes('person')) return 'bg-purple-500/20 text-purple-400'
    if (lower.includes('trend')) return 'bg-orange-500/20 text-orange-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">💡</span></div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.nicheLabel} *</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contentTypeLabel}</label><select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.contentTypes).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>

          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.audienceLabel}</label><input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder={t.audiencePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>💡</span>{t.generate}</>)}</button>

        {result.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><span>🎯</span>{t.results}</h2>
            <div className="grid gap-4">
              {result.map((idea, i) => (
                <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 hover:border-purple-500/50 transition">
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">{idea.id}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                      <p className="text-gray-400 mb-3">{idea.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">{t.format}: {idea.format}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>{idea.category}</span>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <span className="text-xs text-gray-400">{t.hook}:</span>
                        <p className="text-sm text-green-400 font-medium">"{idea.hook}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
