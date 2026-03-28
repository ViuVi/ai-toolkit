'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { resultToMarkdown, resultToPlainText, downloadFile } from '@/lib/export-utils'

const toolIcons: Record<string, string> = {
  'hook-generator': '🎣', 'caption-generator': '✍️', 'script-studio': '🎬',
  'video-finder': '🔍', 'trend-radar': '📡', 'steal-video': '🎯',
  'content-planner': '📅', 'viral-analyzer': '📊', 'hashtag-research': '#️⃣',
  'competitor-spy': '🕵️', 'ab-tester': '⚔️', 'carousel-planner': '🎠',
  'thread-composer': '🧵', 'engagement-booster': '🚀', 'posting-optimizer': '⏰',
  'content-repurposer': '♻️'
}

const texts: Record<string, Record<string, string>> = {
  en: { title: 'Content Library', subtitle: 'All your AI-generated content in one place', all: 'All', favorites: 'Favorites', search: 'Search content...', empty: 'No content yet', emptyDesc: 'Start using tools to fill your library', delete: 'Delete', confirmDelete: 'Are you sure?', noResults: 'No results found', showing: 'Showing', of: 'of', items: 'items', prev: 'Previous', next: 'Next' },
  tr: { title: 'İçerik Kütüphanesi', subtitle: 'Tüm AI üretimlerini tek yerde gör', all: 'Tümü', favorites: 'Favoriler', search: 'İçerik ara...', empty: 'Henüz içerik yok', emptyDesc: 'Araçları kullanarak kütüphanenizi doldurun', delete: 'Sil', confirmDelete: 'Emin misiniz?', noResults: 'Sonuç bulunamadı', showing: 'Gösterilen', of: '/', items: 'içerik', prev: 'Önceki', next: 'Sonraki' },
  ru: { title: 'Библиотека контента', subtitle: 'Весь ваш AI-контент в одном месте', all: 'Все', favorites: 'Избранное', search: 'Поиск...', empty: 'Пока нет контента', emptyDesc: 'Используйте инструменты', delete: 'Удалить', confirmDelete: 'Вы уверены?', noResults: 'Ничего не найдено', showing: 'Показано', of: 'из', items: 'элементов', prev: 'Назад', next: 'Далее' },
  de: { title: 'Inhaltsbibliothek', subtitle: 'Alle KI-Inhalte an einem Ort', all: 'Alle', favorites: 'Favoriten', search: 'Suchen...', empty: 'Noch keine Inhalte', emptyDesc: 'Nutzen Sie die Tools', delete: 'Löschen', confirmDelete: 'Sind Sie sicher?', noResults: 'Keine Ergebnisse', showing: 'Angezeigt', of: 'von', items: 'Elemente', prev: 'Zurück', next: 'Weiter' },
  fr: { title: 'Bibliothèque', subtitle: 'Tout votre contenu IA en un seul endroit', all: 'Tout', favorites: 'Favoris', search: 'Rechercher...', empty: 'Pas encore de contenu', emptyDesc: 'Utilisez les outils', delete: 'Supprimer', confirmDelete: 'Êtes-vous sûr ?', noResults: 'Aucun résultat', showing: 'Affichage', of: 'sur', items: 'éléments', prev: 'Précédent', next: 'Suivant' }
}

function getPreviewText(result: any): string {
  if (!result) return ''
  if (result.raw) return result.raw.substring(0, 150)
  if (result.hooks?.[0]?.text) return result.hooks[0].text
  if (result.captions?.[0]?.text) return result.captions[0].text
  if (result.script?.full_script) return result.script.full_script.substring(0, 150)
  if (result.best_hook?.text) return result.best_hook.text
  if (result.best_caption?.text) return result.best_caption.text
  if (result.winner) return `Winner: ${result.winner}`
  if (result.trends?.[0]?.trend) return result.trends[0].trend
  if (result.carousel?.title) return result.carousel.title
  if (result.tweets?.[0]?.text) return result.tweets[0].text
  if (result.repurposed?.[0]?.content) return result.repurposed[0].content.substring(0, 150)
  if (result.final_score) return `Viral Score: ${result.final_score}/100`
  const str = JSON.stringify(result).substring(0, 150)
  return str.length > 140 ? str.substring(0, 140) + '...' : str
}

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [favOnly, setFavOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()
  const { language } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        fetchLibrary(session.user.id, 1, 'all', false, '')
      }
    })
  }, [router])

  const fetchLibrary = async (userId: string, p: number, tool: string, fav: boolean, q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ userId, page: p.toString() })
      if (tool !== 'all') params.set('tool', tool)
      if (fav) params.set('favorites', 'true')
      if (q) params.set('search', q)

      const res = await fetch(`/api/content-library?${params}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items)
        setTotal(data.total)
        setPage(data.page)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('Library fetch error:', err)
    }
    setLoading(false)
  }

  const handleFilter = (tool: string) => {
    setFilter(tool)
    setPage(1)
    if (user) fetchLibrary(user.id, 1, tool, favOnly, search)
  }

  const handleFavToggle = () => {
    const newFav = !favOnly
    setFavOnly(newFav)
    setPage(1)
    if (user) fetchLibrary(user.id, 1, filter, newFav, search)
  }

  const handleSearch = () => {
    setPage(1)
    if (user) fetchLibrary(user.id, 1, filter, favOnly, search)
  }

  const handlePageChange = (newPage: number) => {
    if (user) fetchLibrary(user.id, newPage, filter, favOnly, search)
  }

  const toggleFavorite = async (contentId: string) => {
    if (!user) return
    const res = await fetch('/api/content-library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'favorite', contentId, userId: user.id })
    })
    if (res.ok) {
      setItems(items.map(item => item.id === contentId ? { ...item, is_favorite: !item.is_favorite } : item))
    }
  }

  const deleteContent = async (contentId: string) => {
    if (!user || !confirm(t.confirmDelete)) return
    const res = await fetch('/api/content-library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', contentId, userId: user.id })
    })
    if (res.ok) {
      setItems(items.filter(item => item.id !== contentId))
      setTotal(total - 1)
    }
  }

  const toolList = ['all', 'hook-generator', 'caption-generator', 'script-studio', 'video-finder', 'trend-radar', 'steal-video', 'content-planner', 'viral-analyzer', 'hashtag-research', 'competitor-spy', 'ab-tester', 'carousel-planner', 'thread-composer', 'engagement-booster', 'posting-optimizer', 'content-repurposer']

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <h1 className="font-bold text-lg">📚 {t.title}</h1>
          </div>
          <div className="text-sm text-gray-400">{total} {t.items}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={t.search}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <span className="absolute left-3 top-3.5 text-gray-500">🔍</span>
            </div>
            <button onClick={handleFavToggle} className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${favOnly ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              ⭐ {t.favorites}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {toolList.map(tool => (
              <button key={tool} onClick={() => handleFilter(tool)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${filter === tool ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'}`}>
                {tool === 'all' ? '📦' : toolIcons[tool] || '🔧'} {tool === 'all' ? t.all : tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-medium mb-2">{search ? t.noResults : t.empty}</h3>
            <p className="text-gray-500">{t.emptyDesc}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/20 transition group">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{toolIcons[item.tool_name] || '🔧'}</span>
                      <span className="text-sm font-medium text-purple-400">{item.tool_display_name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => {
                        const md = resultToMarkdown(item.tool_name, item.input_summary || '', item.result, item.created_at)
                        downloadFile(md, `${item.tool_name}-${Date.now()}.md`, 'text/markdown')
                      }} className="p-1.5 hover:bg-white/10 rounded-lg transition text-gray-500 hover:text-white" title="Markdown">
                        📄
                      </button>
                      <button onClick={() => {
                        const txt = resultToPlainText(item.tool_name, item.input_summary || '', item.result)
                        navigator.clipboard.writeText(txt)
                      }} className="p-1.5 hover:bg-white/10 rounded-lg transition text-gray-500 hover:text-white" title="Copy">
                        📋
                      </button>
                      <button onClick={() => toggleFavorite(item.id)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
                        {item.is_favorite ? '⭐' : '☆'}
                      </button>
                      <button onClick={() => deleteContent(item.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition text-gray-500 hover:text-red-400">
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Input summary */}
                  {item.input_summary && (
                    <p className="text-xs text-gray-500 mb-2 truncate">📝 {item.input_summary}</p>
                  )}

                  {/* Preview */}
                  <div className="text-sm text-gray-300 mb-3 line-clamp-3" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                    {getPreviewText(item.result)}
                  </div>

                  {/* Expanded view */}
                  {expandedId === item.id && (
                    <div className="mt-3 pt-3 border-t border-white/5 max-h-60 overflow-y-auto">
                      <pre className="text-xs text-gray-400 whitespace-pre-wrap">{JSON.stringify(item.result, null, 2)}</pre>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="text-xs text-purple-400 hover:text-purple-300 transition">
                      {expandedId === item.id ? '▲ Less' : '▼ More'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm disabled:opacity-30 hover:bg-white/10 transition">{t.prev}</button>
                <span className="px-4 py-2 text-sm text-gray-400">{page} {t.of} {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm disabled:opacity-30 hover:bg-white/10 transition">{t.next}</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
