'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: Record<string, Record<string, string>> = {
  tr: { welcome: 'Hoş Geldin', credits: 'Kredi', logout: 'Çıkış Yap', create: 'Oluşturma', analyze: 'Analiz', optimize: 'Optimizasyon', allTools: 'Tüm Araçlar', changePhoto: 'Fotoğraf Değiştir', uploadPhoto: 'Fotoğraf Yükle', uploading: 'Yükleniyor...', removePhoto: 'Fotoğrafı Kaldır', uploadError: 'Yükleme hatası', uploadSuccess: 'Fotoğraf güncellendi' },
  en: { welcome: 'Welcome', credits: 'Credits', logout: 'Log Out', create: 'Create', analyze: 'Analyze', optimize: 'Optimize', allTools: 'All Tools', changePhoto: 'Change Photo', uploadPhoto: 'Upload Photo', uploading: 'Uploading...', removePhoto: 'Remove Photo', uploadError: 'Upload failed', uploadSuccess: 'Photo updated' },
  ru: { welcome: 'Добро пожаловать', credits: 'Кредиты', logout: 'Выйти', create: 'Создать', analyze: 'Анализ', optimize: 'Оптимизация', allTools: 'Все инструменты', changePhoto: 'Изменить фото', uploadPhoto: 'Загрузить', uploading: 'Загрузка...', removePhoto: 'Удалить фото', uploadError: 'Ошибка загрузки', uploadSuccess: 'Фото обновлено' },
  de: { welcome: 'Willkommen', credits: 'Credits', logout: 'Abmelden', create: 'Erstellen', analyze: 'Analysieren', optimize: 'Optimieren', allTools: 'Alle Tools', changePhoto: 'Foto ändern', uploadPhoto: 'Hochladen', uploading: 'Lädt...', removePhoto: 'Foto entfernen', uploadError: 'Upload fehlgeschlagen', uploadSuccess: 'Foto aktualisiert' },
  fr: { welcome: 'Bienvenue', credits: 'Crédits', logout: 'Déconnexion', create: 'Créer', analyze: 'Analyser', optimize: 'Optimiser', allTools: 'Tous les outils', changePhoto: 'Changer la photo', uploadPhoto: 'Télécharger', uploading: 'Téléchargement...', removePhoto: 'Supprimer', uploadError: 'Échec du téléchargement', uploadSuccess: 'Photo mise à jour' }
}

const tools = [
  { icon: '🔍', name: 'Viral Video Finder', slug: 'video-finder', credits: 5, category: 'analyze' },
  { icon: '🎣', name: 'Hook Generator', slug: 'hook-generator', credits: 3, category: 'create' },
  { icon: '✍️', name: 'Caption Generator', slug: 'caption-generator', credits: 3, category: 'create' },
  { icon: '🎯', name: 'Steal This Video', slug: 'steal-video', credits: 8, category: 'analyze' },
  { icon: '🔬', name: 'Viral Analyzer', slug: 'viral-analyzer', credits: 5, category: 'analyze' },
  { icon: '🎬', name: 'Script Studio', slug: 'script-studio', credits: 6, category: 'create' },
  { icon: '📅', name: 'Content Calendar', slug: 'content-planner', credits: 10, category: 'optimize' },
  { icon: '📡', name: 'Trend Radar', slug: 'trend-radar', credits: 4, category: 'analyze' },
  { icon: '🕵️', name: 'Competitor Spy', slug: 'competitor-spy', credits: 8, category: 'analyze' },
  { icon: '#️⃣', name: 'Hashtag Research', slug: 'hashtag-research', credits: 3, category: 'optimize' },
  { icon: '♻️', name: 'Content Repurposer', slug: 'content-repurposer', credits: 8, category: 'create' },
  { icon: '⚖️', name: 'A/B Tester', slug: 'ab-tester', credits: 5, category: 'analyze' },
  { icon: '🎠', name: 'Carousel Planner', slug: 'carousel-planner', credits: 5, category: 'create' },
  { icon: '🚀', name: 'Engagement Booster', slug: 'engagement-booster', credits: 4, category: 'optimize' },
  { icon: '⏰', name: 'Posting Optimizer', slug: 'posting-optimizer', credits: 2, category: 'optimize' },
  { icon: '🧵', name: 'Thread Composer', slug: 'thread-composer', credits: 5, category: 'create' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [filter, setFilter] = useState('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  const getUserName = (): string => {
    if (!user) return ''
    if (user.user_metadata?.full_name) return user.user_metadata.full_name
    if (user.user_metadata?.name) return user.user_metadata.name
    if (user.email) return user.email.split('@')[0]
    return ''
  }

  const getInitial = (): string => {
    const name = getUserName()
    return name ? name[0].toUpperCase() : 'U'
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        supabase.from('credits').select('balance, avatar_url').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setCredits(data.balance || 0)
            setAvatarUrl(data.avatar_url || null)
          }
        })
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setUploadMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setAvatarUrl(data.url)
        setUploadMessage({ type: 'success', text: t.uploadSuccess })
        setTimeout(() => {
          setShowAvatarModal(false)
          setUploadMessage(null)
        }, 1500)
      } else {
        setUploadMessage({ type: 'error', text: data.error || t.uploadError })
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: t.uploadError })
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAvatar = async () => {
    if (!user) return
    await supabase.from('credits').update({ avatar_url: null }).eq('user_id', user.id)
    setAvatarUrl(null)
    setShowAvatarModal(false)
  }

  const renderAvatar = (size: string = 'w-10 h-10', textSize: string = 'text-lg') => {
    if (avatarUrl) {
      return <img src={avatarUrl} alt="Avatar" className={`${size} rounded-xl object-cover`} />
    }
    return (
      <div className={`${size} rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold ${textSize}`}>
        {getInitial()}
      </div>
    )
  }

  const filteredTools = filter === 'all' ? tools : tools.filter(tool => tool.category === filter)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">M</div>
            <span className="text-xl font-bold hidden sm:block">MediaToolkit</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <span className="text-purple-400">✦</span>
              <span className="font-semibold">{credits}</span>
              <span className="text-gray-500 text-sm hidden sm:inline">{t.credits}</span>
            </div>

            {/* Language */}
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="relative group">
              <button className="flex items-center gap-2 cursor-pointer">
                {renderAvatar('w-10 h-10', 'text-lg')}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="font-semibold text-white">{getUserName()}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <button onClick={() => setShowAvatarModal(true)} className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
                  {t.changePhoto}
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-800 transition">
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.welcome}, {getUserName()} 👋</h1>
          <p className="text-gray-500">Ready to create viral content?</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: t.allTools, icon: '📦' },
            { key: 'create', label: t.create, icon: '✨' },
            { key: 'analyze', label: t.analyze, icon: '🔍' },
            { key: 'optimize', label: t.optimize, icon: '⚡' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${filter === f.key ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}>
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{tool.icon}</span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium">{tool.credits} ✦</span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition">{tool.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${tool.category === 'create' ? 'bg-green-500' : tool.category === 'analyze' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                {tool.category === 'create' ? t.create : tool.category === 'analyze' ? t.analyze : t.optimize}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.changePhoto}</h2>
              <button onClick={() => setShowAvatarModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            {/* Current Avatar */}
            <div className="flex justify-center mb-6">
              {renderAvatar('w-28 h-28', 'text-5xl')}
            </div>

            {/* Message */}
            {uploadMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm text-center ${uploadMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {uploadMessage.text}
              </div>
            )}

            {/* Upload Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={uploadAvatar} 
              accept="image/jpeg,image/png,image/gif,image/webp" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading} 
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
            >
              {uploading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t.uploading}
                </>
              ) : (
                t.uploadPhoto
              )}
            </button>

            <p className="text-center text-gray-500 text-xs mb-4">JPG, PNG, GIF, WebP • Max 5MB</p>

            {/* Remove Button */}
            {avatarUrl && (
              <button onClick={removeAvatar} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-500/30 transition">
                {t.removePhoto}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
