'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Brand Voice Analyzer', subtitle: 'Analyze your content samples and define your unique brand voice', credits: '2 Credits',
    brandLabel: 'Brand / Company Name', brandPlaceholder: 'Your brand name',
    industryLabel: 'Industry', industryPlaceholder: 'e.g. Fashion, Tech, Food, Fitness...',
    audienceLabel: 'Target Audience', audiencePlaceholder: 'e.g. Young professionals, Parents, Students...',
    samplesLabel: 'Content Samples', samplesHint: 'Paste 2-5 examples of your existing content (captions, posts, emails)',
    samplePlaceholder: 'Paste your content sample here...',
    addSample: '+ Add Another Sample', removeSample: 'Remove',
    analyze: 'Analyze Brand Voice', analyzing: 'AI analyzing your brand...',
    voice: 'Voice Characteristics', tone: 'Tone Profile', style: 'Writing Style',
    personality: 'Brand Personality', doList: '✓ Do This', dontList: '✗ Avoid This',
    phrases: 'Signature Phrases', recommendations: 'Recommendations', summary: 'Brand Voice Summary',
    formality: 'Formality', complexity: 'Complexity', warmth: 'Warmth',
    primary: 'Primary', secondary: 'Secondary', energy: 'Energy',
    emptyInput: 'Enter brand name and at least one content sample', success: 'Analysis complete!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Marka Sesi Analizi', subtitle: 'İçerik örneklerinizi analiz edin ve benzersiz marka sesinizi tanımlayın', credits: '2 Kredi',
    brandLabel: 'Marka / Şirket Adı', brandPlaceholder: 'Marka adınız',
    industryLabel: 'Sektör', industryPlaceholder: 'örn: Moda, Teknoloji, Gıda, Fitness...',
    audienceLabel: 'Hedef Kitle', audiencePlaceholder: 'örn: Genç profesyoneller, Ebeveynler, Öğrenciler...',
    samplesLabel: 'İçerik Örnekleri', samplesHint: 'Mevcut içeriklerinizden 2-5 örnek yapıştırın (caption, post, email)',
    samplePlaceholder: 'İçerik örneğinizi buraya yapıştırın...',
    addSample: '+ Başka Örnek Ekle', removeSample: 'Kaldır',
    analyze: 'Marka Sesini Analiz Et', analyzing: 'AI markanızı analiz ediyor...',
    voice: 'Ses Karakteristikleri', tone: 'Ton Profili', style: 'Yazım Stili',
    personality: 'Marka Kişiliği', doList: '✓ Yapın', dontList: '✗ Yapmayın',
    phrases: 'İmza İfadeler', recommendations: 'Öneriler', summary: 'Marka Sesi Özeti',
    formality: 'Formalite', complexity: 'Karmaşıklık', warmth: 'Sıcaklık',
    primary: 'Birincil', secondary: 'İkincil', energy: 'Enerji',
    emptyInput: 'Marka adı ve en az bir içerik örneği girin', success: 'Analiz tamamlandı!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Анализ голоса бренда', subtitle: 'Определите уникальный голос бренда', credits: '2 кредита', brandLabel: 'Название бренда', brandPlaceholder: 'Ваш бренд', industryLabel: 'Индустрия', industryPlaceholder: 'напр: Мода...', audienceLabel: 'Аудитория', audiencePlaceholder: 'напр: Молодые...', samplesLabel: 'Примеры контента', samplesHint: '2-5 примеров', samplePlaceholder: 'Вставьте пример...', addSample: '+ Добавить', removeSample: 'Удалить', analyze: 'Анализировать', analyzing: 'Анализ...', voice: 'Характеристики', tone: 'Тон', style: 'Стиль', personality: 'Личность', doList: '✓ Делайте', dontList: '✗ Избегайте', phrases: 'Фразы', recommendations: 'Рекомендации', summary: 'Резюме', formality: 'Формальность', complexity: 'Сложность', warmth: 'Теплота', primary: 'Основной', secondary: 'Вторичный', energy: 'Энергия', emptyInput: 'Заполните поля', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Markenstimme Analyse', subtitle: 'Definieren Sie Ihre einzigartige Markenstimme', credits: '2 Credits', brandLabel: 'Markenname', brandPlaceholder: 'Ihre Marke', industryLabel: 'Branche', industryPlaceholder: 'z.B. Mode...', audienceLabel: 'Zielgruppe', audiencePlaceholder: 'z.B. Junge...', samplesLabel: 'Inhaltsbeispiele', samplesHint: '2-5 Beispiele', samplePlaceholder: 'Beispiel einfügen...', addSample: '+ Hinzufügen', removeSample: 'Entfernen', analyze: 'Analysieren', analyzing: 'Analyse...', voice: 'Eigenschaften', tone: 'Ton', style: 'Stil', personality: 'Persönlichkeit', doList: '✓ Tun', dontList: '✗ Vermeiden', phrases: 'Phrasen', recommendations: 'Empfehlungen', summary: 'Zusammenfassung', formality: 'Formalität', complexity: 'Komplexität', warmth: 'Wärme', primary: 'Primär', secondary: 'Sekundär', energy: 'Energie', emptyInput: 'Felder ausfüllen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse de la voix de marque', subtitle: 'Définissez votre voix de marque unique', credits: '2 crédits', brandLabel: 'Nom de marque', brandPlaceholder: 'Votre marque', industryLabel: 'Industrie', industryPlaceholder: 'ex: Mode...', audienceLabel: 'Audience', audiencePlaceholder: 'ex: Jeunes...', samplesLabel: 'Exemples', samplesHint: '2-5 exemples', samplePlaceholder: 'Coller exemple...', addSample: '+ Ajouter', removeSample: 'Supprimer', analyze: 'Analyser', analyzing: 'Analyse...', voice: 'Caractéristiques', tone: 'Ton', style: 'Style', personality: 'Personnalité', doList: '✓ Faire', dontList: '✗ Éviter', phrases: 'Phrases', recommendations: 'Recommandations', summary: 'Résumé', formality: 'Formalité', complexity: 'Complexité', warmth: 'Chaleur', primary: 'Principal', secondary: 'Secondaire', energy: 'Énergie', emptyInput: 'Remplir champs', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function BrandVoicePage() {
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [samples, setSamples] = useState(['', ''])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const addSample = () => { if (samples.length < 5) setSamples([...samples, '']) }
  const removeSample = (i: number) => { if (samples.length > 1) setSamples(samples.filter((_, idx) => idx !== i)) }
  const updateSample = (i: number, val: string) => { const arr = [...samples]; arr[i] = val; setSamples(arr) }

  const handleAnalyze = async () => {
    if (!brandName.trim() || !samples.some(s => s.trim())) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/brand-voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brandName, industry, targetAudience, contentSamples: samples.filter(s => s.trim()), userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🎯</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.brandLabel} *</label><input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder={t.brandPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.industryLabel}</label><input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={t.industryPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.audienceLabel}</label><input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder={t.audiencePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-300">{t.samplesLabel} *</label><span className="text-xs text-gray-500">{t.samplesHint}</span></div>
            <div className="space-y-3">
              {samples.map((s, i) => (
                <div key={i} className="relative">
                  <textarea value={s} onChange={(e) => updateSample(i, e.target.value)} placeholder={`${t.samplePlaceholder} ${i + 1}`} className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                  {samples.length > 1 && (<button onClick={() => removeSample(i)} className="absolute top-2 right-2 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30">{t.removeSample}</button>)}
                </div>
              ))}
            </div>
            {samples.length < 5 && (<button onClick={addSample} className="mt-3 text-purple-400 text-sm hover:underline">{t.addSample}</button>)}
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🎯</span>{t.analyze}</>)}</button>
        
        {result && (
          <div className="space-y-6">
            {result.voiceCharacteristics && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>🎤</span>{t.voice}</h3><div className="flex flex-wrap gap-2">{result.voiceCharacteristics.map((v: string, i: number) => (<span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full font-medium border border-purple-500/30">{v}</span>))}</div></div>)}
            
            {result.toneProfile && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>🎭</span>{t.tone}</h3><div className="grid grid-cols-3 gap-4"><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{t.primary}</p><p className="text-lg font-bold text-purple-400">{result.toneProfile.primary}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{t.secondary}</p><p className="text-lg font-bold text-blue-400">{result.toneProfile.secondary}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{t.energy}</p><p className="text-lg font-bold text-green-400">{result.toneProfile.energy}</p></div></div></div>)}
            
            {result.writingStyle && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>✍️</span>{t.style}</h3><div className="grid grid-cols-3 gap-4">{[{k:'formality',l:t.formality,c:'purple'},{k:'complexity',l:t.complexity,c:'blue'},{k:'warmth',l:t.warmth,c:'pink'}].map(item => (<div key={item.k} className="bg-gray-900/50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-2">{item.l}</p><div className="flex items-center gap-2"><div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full bg-${item.c}-500`} style={{width:`${parseInt(result.writingStyle[item.k])*10}%`}}></div></div><span className="font-bold text-sm">{result.writingStyle[item.k]}/10</span></div></div>))}</div></div>)}
            
            {result.personality && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>💫</span>{t.personality}</h3><div className="flex flex-wrap gap-2">{result.personality.map((p: string, i: number) => (<span key={i} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-medium">{p}</span>))}</div></div>)}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.doList && (<div className="bg-gray-800/50 rounded-2xl border border-green-500/30 p-6"><h3 className="text-lg font-semibold mb-4 text-green-400">{t.doList}</h3><ul className="space-y-2">{result.doList.map((d: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400 mt-0.5">✓</span><span>{d}</span></li>))}</ul></div>)}
              {result.dontList && (<div className="bg-gray-800/50 rounded-2xl border border-red-500/30 p-6"><h3 className="text-lg font-semibold mb-4 text-red-400">{t.dontList}</h3><ul className="space-y-2">{result.dontList.map((d: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-400 mt-0.5">✗</span><span>{d}</span></li>))}</ul></div>)}
            </div>
            
            {result.samplePhrases && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>💬</span>{t.phrases}</h3><div className="space-y-2">{result.samplePhrases.map((p: string, i: number) => (<div key={i} className="bg-gray-900/50 rounded-xl p-4 italic text-gray-300 border-l-4 border-purple-500">"{p}"</div>))}</div></div>)}
            
            {result.summary && (<div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6"><h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><span>📋</span>{t.summary}</h3><p className="text-gray-300 leading-relaxed">{result.summary}</p></div>)}
          </div>
        )}
      </main>
    </div>
  )
}
