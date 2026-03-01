'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Viral Score', subtitle: 'Upload your short video and predict its viral potential', credits: 'FREE',
    uploadLabel: 'Upload Video', uploadHint: 'MP4, MOV, WebM • Max 60 sec • Max 50MB',
    dragDrop: 'Drag & drop or click to upload', selectedFile: 'Selected',
    descLabel: 'Video Description (Optional)', descPlaceholder: 'Describe your video content, hook, and CTA...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram Reels', youtube: 'YouTube Shorts' },
    analyze: 'Analyze Viral Potential', analyzing: 'AI analyzing your video...',
    score: 'Viral Score', breakdown: 'Score Breakdown', strengths: 'What Works', improvements: 'How to Improve',
    performance: 'Predicted Performance', views: 'Est. Views', bestTime: 'Best Post Time', probability: 'Viral Probability',
    expertTip: 'Expert Tip', removeVideo: 'Remove',
    hookStrength: 'Hook', contentQuality: 'Quality', emotionalImpact: 'Emotion', shareability: 'Shareability', trendAlignment: 'Trends',
    noVideo: 'Please upload a video', success: 'Analysis complete!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Viral Skor', subtitle: 'Kısa videonuzu yükleyin ve viral potansiyelini tahmin edin', credits: 'ÜCRETSİZ',
    uploadLabel: 'Video Yükle', uploadHint: 'MP4, MOV, WebM • Maks 60 sn • Maks 50MB',
    dragDrop: 'Sürükle bırak veya tıkla', selectedFile: 'Seçildi',
    descLabel: 'Video Açıklaması (Opsiyonel)', descPlaceholder: 'Video içeriğinizi, hook ve CTA\'nızı açıklayın...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram Reels', youtube: 'YouTube Shorts' },
    analyze: 'Viral Potansiyeli Analiz Et', analyzing: 'AI videonuzu analiz ediyor...',
    score: 'Viral Skoru', breakdown: 'Skor Detayları', strengths: 'İşe Yarayan', improvements: 'Nasıl Geliştirirsin',
    performance: 'Tahmini Performans', views: 'Tah. Görüntülenme', bestTime: 'En İyi Paylaşım', probability: 'Viral Olasılığı',
    expertTip: 'Uzman Tavsiyesi', removeVideo: 'Kaldır',
    hookStrength: 'Hook', contentQuality: 'Kalite', emotionalImpact: 'Duygu', shareability: 'Paylaşılabilirlik', trendAlignment: 'Trend',
    noVideo: 'Lütfen video yükleyin', success: 'Analiz tamamlandı!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Вирусный рейтинг', subtitle: 'Загрузите видео для анализа', credits: 'БЕСПЛАТНО', uploadLabel: 'Загрузить', uploadHint: 'MP4, MOV • Макс 60 сек', dragDrop: 'Перетащите или нажмите', selectedFile: 'Выбрано', descLabel: 'Описание', descPlaceholder: 'Опишите видео...', platformLabel: 'Платформа', platforms: { tiktok: 'TikTok', instagram: 'Instagram Reels', youtube: 'YouTube Shorts' }, analyze: 'Анализировать', analyzing: 'Анализ...', score: 'Рейтинг', breakdown: 'Детали', strengths: 'Сильные стороны', improvements: 'Улучшения', performance: 'Прогноз', views: 'Просмотры', bestTime: 'Лучшее время', probability: 'Вероятность', expertTip: 'Совет', removeVideo: 'Удалить', hookStrength: 'Хук', contentQuality: 'Качество', emotionalImpact: 'Эмоции', shareability: 'Распространение', trendAlignment: 'Тренды', noVideo: 'Загрузите видео', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Viral Score', subtitle: 'Video hochladen für Analyse', credits: 'KOSTENLOS', uploadLabel: 'Hochladen', uploadHint: 'MP4, MOV • Max 60 Sek', dragDrop: 'Ziehen oder klicken', selectedFile: 'Ausgewählt', descLabel: 'Beschreibung', descPlaceholder: 'Video beschreiben...', platformLabel: 'Plattform', platforms: { tiktok: 'TikTok', instagram: 'Instagram Reels', youtube: 'YouTube Shorts' }, analyze: 'Analysieren', analyzing: 'Analyse...', score: 'Score', breakdown: 'Details', strengths: 'Stärken', improvements: 'Verbesserungen', performance: 'Prognose', views: 'Views', bestTime: 'Beste Zeit', probability: 'Wahrscheinlichkeit', expertTip: 'Tipp', removeVideo: 'Entfernen', hookStrength: 'Hook', contentQuality: 'Qualität', emotionalImpact: 'Emotion', shareability: 'Teilbarkeit', trendAlignment: 'Trends', noVideo: 'Video hochladen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Score Viral', subtitle: 'Téléchargez votre vidéo pour analyse', credits: 'GRATUIT', uploadLabel: 'Télécharger', uploadHint: 'MP4, MOV • Max 60 sec', dragDrop: 'Glisser ou cliquer', selectedFile: 'Sélectionné', descLabel: 'Description', descPlaceholder: 'Décrivez la vidéo...', platformLabel: 'Plateforme', platforms: { tiktok: 'TikTok', instagram: 'Instagram Reels', youtube: 'YouTube Shorts' }, analyze: 'Analyser', analyzing: 'Analyse...', score: 'Score', breakdown: 'Détails', strengths: 'Forces', improvements: 'Améliorations', performance: 'Prévisions', views: 'Vues', bestTime: 'Meilleur moment', probability: 'Probabilité', expertTip: 'Conseil', removeVideo: 'Supprimer', hookStrength: 'Hook', contentQuality: 'Qualité', emotionalImpact: 'Émotion', shareability: 'Partage', trendAlignment: 'Tendances', noVideo: 'Téléchargez vidéo', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function ViralScorePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) return
    if (file.size > 50 * 1024 * 1024) { showToast('Max 50MB', 'warning'); return }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]) }
  const removeVideo = () => { setVideoFile(null); setVideoPreview(null); setResult(null) }

  const handleAnalyze = async () => {
    if (!videoFile) { showToast(t.noVideo, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('platform', platform)
      formData.append('description', description)
      formData.append('language', language)
      const res = await fetch('/api/viral-score', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getScoreColor = (s: number) => s >= 70 ? 'from-green-500 to-emerald-500' : s >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500'
  const getBarColor = (s: number) => s >= 70 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🚀</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.uploadLabel}</label>
            {!videoFile ? (
              <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition">
                <div className="text-5xl mb-3">📹</div>
                <p className="text-gray-300 font-medium">{t.dragDrop}</p>
                <p className="text-gray-500 text-sm mt-1">{t.uploadHint}</p>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-4 flex items-center gap-4">
                {videoPreview && <video src={videoPreview} className="w-24 h-16 object-cover rounded-lg" />}
                <div className="flex-1"><p className="font-medium truncate">{videoFile.name}</p><p className="text-sm text-gray-400">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p></div>
                <button onClick={removeVideo} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">{t.removeVideo}</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.descLabel}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.descPlaceholder} className="w-full h-20 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><div className="flex gap-2">{Object.entries(t.platforms).map(([k, v]) => (<button key={k} onClick={() => setPlatform(k)} className={`px-4 py-2 rounded-xl font-medium transition ${platform === k ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{v as string}</button>))}</div></div>
        </div>

        <button onClick={handleAnalyze} disabled={loading || !videoFile} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🚀</span>{t.analyze}</>)}</button>

        {result?.analysis && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${getScoreColor(result.analysis.viralScore)} rounded-2xl p-8 text-center`}>
              <h2 className="text-lg text-white/80 mb-2">{t.score}</h2>
              <p className="text-7xl font-bold text-white">{result.analysis.viralScore}<span className="text-3xl">/100</span></p>
              <p className="text-white/80 mt-2">{t.probability}: {result.analysis.viralProbability}</p>
            </div>

            {result.analysis.breakdown && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">{t.breakdown}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[{k:'hookStrength',l:t.hookStrength},{k:'contentQuality',l:t.contentQuality},{k:'emotionalImpact',l:t.emotionalImpact},{k:'shareability',l:t.shareability},{k:'trendAlignment',l:t.trendAlignment}].map(item => (
                    <div key={item.k} className="bg-gray-900/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">{item.l}</p>
                      <p className={`text-xl font-bold ${result.analysis.breakdown[item.k] >= 70 ? 'text-green-400' : result.analysis.breakdown[item.k] >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{result.analysis.breakdown[item.k]}</p>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2"><div className={`h-full rounded-full ${getBarColor(result.analysis.breakdown[item.k])}`} style={{width:`${result.analysis.breakdown[item.k]}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center"><span className="text-3xl">👁️</span><p className="text-2xl font-bold mt-2">{result.analysis.predictedViews}</p><p className="text-sm text-gray-400">{t.views}</p></div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center"><span className="text-3xl">⏰</span><p className="text-lg font-bold mt-2 text-green-400">{result.analysis.bestPostingTime}</p><p className="text-sm text-gray-400">{t.bestTime}</p></div>
            </div>

            {result.analysis.strengths && (<div className="bg-gray-800/50 rounded-2xl border border-green-500/30 p-6"><h3 className="text-lg font-semibold mb-3 text-green-400">{t.strengths}</h3><ul className="space-y-2">{result.analysis.strengths.map((s: string, i: number) => (<li key={i} className="flex items-start gap-2"><span className="text-green-400">✓</span>{s}</li>))}</ul></div>)}

            {result.analysis.improvements && (<div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6"><h3 className="text-lg font-semibold mb-3">{t.improvements}</h3><ul className="space-y-2">{result.analysis.improvements.map((s: string, i: number) => (<li key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-2"><span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>{s}</li>))}</ul></div>)}

            {result.analysis.expertTip && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="font-semibold mb-2 flex items-center gap-2"><span>💡</span>{t.expertTip}</h3><p className="text-gray-300">{result.analysis.expertTip}</p></div>)}
          </div>
        )}
      </main>
    </div>
  )
}
