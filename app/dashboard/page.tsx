'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { welcome: 'Hoş Geldin', credits: 'Kredi', tools: 'Araçlar', logout: 'Çıkış Yap', upgrade: 'Yükselt', create: 'Oluşturma', analyze: 'Analiz', optimize: 'Optimizasyon', allTools: 'Tüm Araçlar' },
  en: { welcome: 'Welcome', credits: 'Credits', tools: 'Tools', logout: 'Log Out', upgrade: 'Upgrade', create: 'Create', analyze: 'Analyze', optimize: 'Optimize', allTools: 'All Tools' },
  ru: { welcome: 'Добро пожаловать', credits: 'Кредиты', tools: 'Инструменты', logout: 'Выйти', upgrade: 'Улучшить', create: 'Создать', analyze: 'Анализ', optimize: 'Оптимизация', allTools: 'Все инструменты' },
  de: { welcome: 'Willkommen', credits: 'Credits', tools: 'Tools', logout: 'Abmelden', upgrade: 'Upgrade', create: 'Erstellen', analyze: 'Analysieren', optimize: 'Optimieren', allTools: 'Alle Tools' },
  fr: { welcome: 'Bienvenue', credits: 'Crédits', tools: 'Outils', logout: 'Déconnexion', upgrade: 'Améliorer', create: 'Créer', analyze: 'Analyser', optimize: 'Optimiser', allTools: 'Tous les outils' }
}

// Tema uyumlu hazır avatarlar
type AvatarType = {
  id: string
  type: 'gradient' | 'solid'
  colors?: [string, string]
  color?: string
  icon: string
}

const defaultAvatars: AvatarType[] = [
  { id: 'gradient-1', type: 'gradient', colors: ['#8B5CF6', '#EC4899'], icon: '🚀' },
  { id: 'gradient-2', type: 'gradient', colors: ['#6366F1', '#8B5CF6'], icon: '⚡' },
  { id: 'gradient-3', type: 'gradient', colors: ['#EC4899', '#F97316'], icon: '🔥' },
  { id: 'gradient-4', type: 'gradient', colors: ['#8B5CF6', '#06B6D4'], icon: '💎' },
  { id: 'gradient-5', type: 'gradient', colors: ['#10B981', '#6366F1'], icon: '🎯' },
  { id: 'gradient-6', type: 'gradient', colors: ['#F59E0B', '#EC4899'], icon: '✨' },
  { id: 'gradient-7', type: 'gradient', colors: ['#6366F1', '#EC4899'], icon: '🎬' },
  { id: 'gradient-8', type: 'gradient', colors: ['#8B5CF6', '#F97316'], icon: '📈' },
  { id: 'solid-1', type: 'solid', color: '#8B5CF6', icon: '👤' },
  { id: 'solid-2', type: 'solid', color: '#EC4899', icon: '🎨' },
  { id: 'solid-3', type: 'solid', color: '#6366F1', icon: '💡' },
  { id: 'solid-4', type: 'solid', color: '#10B981', icon: '🌟' },
]

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
  const [filter, setFilter] = useState('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance, avatar_url').eq('user_id', user.id).single().then(({ data }) => {
          if (data) {
            setCredits(data.balance || 0)
            setAvatarUrl(data.avatar_url)
          }
        })
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const selectAvatar = async (avatar: typeof defaultAvatars[0]) => {
    const avatarData = JSON.stringify(avatar)
    await supabase.from('credits').update({ avatar_url: avatarData }).eq('user_id', user.id)
    setAvatarUrl(avatarData)
    setShowAvatarModal(false)
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      await supabase.from('credits').update({ avatar_url: publicUrl }).eq('user_id', user.id)
      setAvatarUrl(publicUrl)
      setShowAvatarModal(false)
    }
    setUploading(false)
  }

  const renderAvatar = (size: string = 'w-10 h-10') => {
    if (!avatarUrl) {
      return <div className={`${size} rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold`}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
    }

    // URL ise (yüklenen fotoğraf)
    if (avatarUrl.startsWith('http')) {
      return <img src={avatarUrl} alt="Avatar" className={`${size} rounded-xl object-cover`} />
    }

    // JSON ise (hazır avatar)
    try {
      const avatar = JSON.parse(avatarUrl)
      const bgStyle = avatar.type === 'gradient' && avatar.colors
        ? { background: `linear-gradient(135deg, ${avatar.colors[0]}, ${avatar.colors[1]})` }
        : { backgroundColor: avatar.color || '#8B5CF6' }
      return <div className={`${size} rounded-xl flex items-center justify-center`} style={bgStyle}><span className="text-lg">{avatar.icon}</span></div>
    } catch {
      return <div className={`${size} rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold`}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
    }
  }

  const filteredTools = filter === 'all' ? tools : tools.filter(t => t.category === filter)

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
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="relative group">
              <button className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                {renderAvatar('w-10 h-10')}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-800">
                  <div className="text-sm text-gray-400">Signed in as</div>
                  <div className="text-sm font-medium truncate">{user?.email}</div>
                </div>
                <button onClick={() => setShowAvatarModal(true)} className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                  <span>🖼️</span> Change Avatar
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2">
                  <span>🚪</span> {t.logout}
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
          <h1 className="text-2xl font-bold">{t.welcome}, {user?.email?.split('@')[0]} 👋</h1>
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Choose Avatar</h2>
              <button onClick={() => setShowAvatarModal(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>

            {/* Current Avatar */}
            <div className="flex justify-center mb-6">
              {renderAvatar('w-24 h-24')}
            </div>

            {/* Upload Button */}
            <div className="mb-6">
              <input type="file" ref={fileInputRef} onChange={uploadAvatar} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Uploading...</> : <>📤 Upload Photo</>}
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm mb-4">— or choose from below —</div>

            {/* Default Avatars */}
            <div className="grid grid-cols-6 gap-3">
              {defaultAvatars.map(avatar => {
                const bgStyle = avatar.type === 'gradient' && avatar.colors
                  ? { background: `linear-gradient(135deg, ${avatar.colors[0]}, ${avatar.colors[1]})` }
                  : { backgroundColor: avatar.color || '#8B5CF6' }
                return (
                  <button key={avatar.id} onClick={() => selectAvatar(avatar)} className="w-12 h-12 rounded-xl flex items-center justify-center hover:scale-110 transition-transform border-2 border-transparent hover:border-white/30" style={bgStyle}>
                    <span>{avatar.icon}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
