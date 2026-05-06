'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { resultToMarkdown, resultToPlainText, downloadFile } from '@/lib/export-utils'

const toolIcons: Record<string, string> = {
  'hook-generator': '🎣', 'caption-generator': '✍️', 'script-studio': '🎬',
  'trend-radar': '📡', 'steal-video': '🎯',
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


function renderResult(result: any, toolName: string): string {
  if (!result) return ''
  
  // Try parse raw
  if (result.raw) {
    try {
      const fb = result.raw.indexOf('{'); const lb = result.raw.lastIndexOf('}')
      if (fb !== -1 && lb !== -1) return renderResult(JSON.parse(result.raw.substring(fb, lb + 1)), toolName)
    } catch {}
    return result.raw
  }

  const sections: string[] = []

  // Hook Generator
  if (result.hooks) {
    result.hooks.forEach((h: any, i: number) => {
      sections.push(`Hook ${i+1}: ${h.text || h.hook || ''}`)
      if (h.why_it_works) sections.push(`  Why: ${h.why_it_works}`)
    })
    if (result.best_hook?.text) sections.push(`\n⭐ Best Hook: ${result.best_hook.text}`)
  }

  // Caption Generator
  if (result.captions) {
    result.captions.forEach((cap: any, i: number) => {
      sections.push(`Caption ${i+1}: ${cap.caption || cap.text || ''}`)
      if (cap.emotion || cap.style) sections.push(`  Style: ${cap.emotion || cap.style}`)
    })
  }

  // Script Studio
  if (result.script?.full_script || result.full_script) {
    sections.push(`📝 Script:\n${result.script?.full_script || result.full_script}`)
    if (result.scene_breakdown) {
      sections.push('\n🎬 Scenes:')
      result.scene_breakdown.forEach((s: any) => sections.push(`  ${s.scene || s.section}: ${s.text || s.section}`))
    }
  }

  // Viral Analyzer
  if (result.final_score || result.viral_score) {
    sections.push(`📊 Viral Score: ${result.final_score || result.viral_score}/100`)
    if (result.verdict || result.overall_verdict) sections.push(`Verdict: ${result.verdict || result.overall_verdict}`)
    if (result.scores || result.breakdown) {
      const s = result.scores || result.breakdown
      Object.entries(s).forEach(([k, v]) => sections.push(`  ${k.replace(/_/g, ' ')}: ${v}/10`))
    }
    if (result.rewritten_hook) sections.push(`\n✨ Improved Hook: ${result.rewritten_hook}`)
  }

  // A/B Tester
  if (result.winner) {
    sections.push(`🏆 Winner: ${result.winner}`)
    if (result.winner_reason || result.recommendation) sections.push(`Reason: ${result.winner_reason || result.recommendation}`)
    if (result.option_a) sections.push(`\nOption A: ${result.option_a.total_score || result.option_a.score || ''}/100`)
    if (result.option_b) sections.push(`Option B: ${result.option_b.total_score || result.option_b.score || ''}/100`)
    if (result.hybrid_suggestion || result.improved_version) sections.push(`\n💡 Hybrid: ${result.hybrid_suggestion || result.improved_version}`)
  }

  // Competitor Spy
  if (result.what_they_do_right) {
    sections.push('✅ Strengths:')
    result.what_they_do_right.forEach((s: any) => sections.push(`  • ${typeof s === 'string' ? s : s.strength || JSON.stringify(s)}`))
  }
  if (result.what_you_can_do_better) {
    sections.push('\n🎯 Opportunities:')
    result.what_you_can_do_better.forEach((w: any) => sections.push(`  • ${typeof w === 'string' ? w : w.weakness || w.your_opportunity || JSON.stringify(w)}`))
  }
  if (result.action_plan && !result.what_they_do_right) {
    sections.push('📋 Action Plan:')
    result.action_plan.forEach((a: any) => sections.push(`  ${typeof a === 'string' ? a : (a.priority ? a.priority + '. ' : '') + (a.action || JSON.stringify(a))}`))
  }

  // Trend Radar
  if (result.trending_topics || result.trends) {
    sections.push('📡 Trending Topics:')
    ;(result.trending_topics || result.trends).forEach((t: any) => {
      sections.push(`  🔥 ${t.topic || t.trend}`)
      if (t.why_trending || t.how_to_use) sections.push(`     ${t.why_trending || t.how_to_use}`)
    })
  }

  // Thread Composer
  if (result.tweets || result.thread?.tweets) {
    sections.push('🧵 Thread:')
    ;(result.tweets || result.thread.tweets).forEach((t: any, i: number) => {
      sections.push(`  ${i+1}. ${t.text || t.content || ''}`)
    })
  }

  // Carousel Planner
  if (result.slides || result.carousel?.slides) {
    if (result.carousel_concept || result.carousel?.title) sections.push(`🎠 ${result.carousel_concept || result.carousel.title}`)
    sections.push('Slides:')
    ;(result.slides || result.carousel.slides).forEach((s: any, i: number) => {
      sections.push(`  ${i+1}. ${s.headline || s.title || s.content || ''}`)
    })
  }

  // Content Planner
  if (result.strategy || result.content_pillars) {
    if (result.content_pillars) sections.push(`📌 Pillars: ${result.content_pillars.join(', ')}`)
    if (result.strategy?.posting_frequency) sections.push(`📅 Frequency: ${result.strategy.posting_frequency}`)
  }
  if (result.calendar) {
    sections.push('\n📅 Calendar:')
    result.calendar.forEach((week: any) => {
      if (week.days) week.days.forEach((day: any) => {
        if (day.posts) day.posts.forEach((post: any) => {
          sections.push(`  ${day.day || ''}: ${post.topic || post.title || ''} (${post.type || post.format || ''})`)
        })
      })
    })
  }

  // Hashtag Research
  if (result.recommended_set?.hashtags || result.hashtag_sets) {
    sections.push('#️⃣ Hashtags:')
    const tags = result.recommended_set?.hashtags || result.hashtag_sets?.flatMap((s: any) => s.hashtags || []) || []
    sections.push(`  ${tags.join(' ')}`)
    if (result.recommended_set?.copy_paste) sections.push(`\n📋 Copy: ${result.recommended_set.copy_paste}`)
  }

  // Content Repurposer
  if (result.repurposed || result.tiktok_scripts || result.instagram_carousel) {
    const platforms = ['tiktok_scripts', 'instagram_carousel', 'twitter_threads', 'linkedin_posts', 'youtube_short']
    const labels: Record<string, string> = { tiktok_scripts: '🎵 TikTok', instagram_carousel: '📸 Instagram', twitter_threads: '🐦 Twitter', linkedin_posts: '💼 LinkedIn', youtube_short: '🎬 YouTube' }
    platforms.forEach(p => {
      const items = result[p]
      if (items?.length) {
        sections.push(`\n${labels[p] || p}:`)
        items.forEach((item: any) => sections.push(`  ${item.content || item.text || JSON.stringify(item).substring(0, 200)}`))
      }
    })
    if (result.repurposed && !result.tiktok_scripts) {
      result.repurposed.forEach((r: any) => sections.push(`\n${r.platform}: ${r.content || r.text || ''}`))
    }
  }

  // Engagement Booster
  if (result.comment_starters || result.engagement_hooks) {
    sections.push('🚀 Engagement Hooks:')
    ;(result.comment_starters || result.engagement_hooks || []).forEach((h: any) => sections.push(`  • ${typeof h === 'string' ? h : h.text || JSON.stringify(h)}`))
  }
  if (result.cta_lines) {
    sections.push('\n📢 CTA Lines:')
    result.cta_lines.forEach((l: any) => sections.push(`  • ${typeof l === 'string' ? l : l.text || JSON.stringify(l)}`))
  }

  // Posting Optimizer
  if (result.optimal_times || result.best_times) {
    sections.push('⏰ Best Posting Times:')
    ;(result.optimal_times || Object.entries(result.best_times || {})).forEach((t: any) => {
      if (Array.isArray(t)) sections.push(`  ${t[0]}: ${typeof t[1] === 'string' ? t[1] : JSON.stringify(t[1])}`)
      else sections.push(`  ${t.day || ''}: ${t.times || t.time || JSON.stringify(t)}`)
    })
  }

  // Steal This Video
  if (result.analysis?.hook_breakdown || result.hook?.text) {
    sections.push(`🎣 Hook: ${result.hook?.text || result.analysis?.hook_breakdown}`)
  }
  if (result.script?.full_script && !result.hooks) {
    sections.push(`\n📝 Script: ${result.script.full_script}`)
  }
  if (result.shot_list) {
    sections.push('\n🎬 Shot List:')
    result.shot_list.forEach((s: any) => sections.push(`  • ${typeof s === 'string' ? s : s.shot || JSON.stringify(s)}`))
  }
  if (result.content_ideas || result.your_versions) {
    sections.push('\n💡 Your Versions:')
    ;(result.content_ideas || result.your_versions).forEach((v: any) => sections.push(`  • ${v.angle || v.hook || v.title || JSON.stringify(v)}`))
  }

  // Bio Generator
  if (result.bios) {
    result.bios.forEach((b: any, i: number) => {
      sections.push(`Bio ${i+1} (${b.platform || ''}): ${b.text || b.bio || ''}`)
    })
  }

  // Video Ideas
  if (result.ideas) {
    result.ideas.forEach((idea: any, i: number) => {
      sections.push(`💡 Idea ${i+1}: ${idea.title || ''}`)
      if (idea.hook) sections.push(`  Hook: ${idea.hook}`)
      if (idea.format) sections.push(`  Format: ${idea.format}`)
      if (idea.why_now) sections.push(`  Why now: ${idea.why_now}`)
    })
  }

  // Viral Score Predictor
  if (result.optimized_content) {
    sections.push(`✨ Optimized: ${result.optimized_content}`)
    if (result.predicted_score_after) sections.push(`Score: ${result.predicted_score_after}/100`)
  }

  // If nothing matched, try generic extraction
  if (sections.length === 0) {
    for (const [key, val] of Object.entries(result)) {
      if (key === 'raw' || key === 'dna_code') continue
      if (typeof val === 'string' && val.length > 0) sections.push(`${key.replace(/_/g, ' ')}: ${val}`)
      else if (Array.isArray(val) && val.length > 0) {
        sections.push(`${key.replace(/_/g, ' ')}:`)
        val.slice(0, 10).forEach((item: any) => sections.push(`  • ${typeof item === 'string' ? item : JSON.stringify(item).substring(0, 150)}`))
      }
    }
  }

  return sections.join('\n')
}

function getPreviewText(result: any): string {
  if (!result) return ''
  
  // Try to extract meaningful text from raw JSON strings
  if (result.raw) {
    // Try to parse raw if it looks like JSON
    try {
      const parsed = typeof result.raw === 'string' && result.raw.trim().startsWith('{') 
        ? JSON.parse(result.raw.substring(result.raw.indexOf('{'), result.raw.lastIndexOf('}') + 1))
        : null
      if (parsed) return getPreviewText(parsed)
    } catch {}
    // Strip markdown fences
    let raw = result.raw.replace(/```json/g, '').replace(/```/g, '').trim()
    if (raw.startsWith('{')) {
      try { return getPreviewText(JSON.parse(raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1))) } catch {}
    }
    return raw.substring(0, 150)
  }

  // Hook Generator
  if (result.hooks?.[0]?.text) return result.hooks[0].text
  if (result.best_hook?.text) return result.best_hook.text

  // Caption Generator
  if (result.captions?.[0]?.text) return result.captions[0].text
  if (result.captions?.[0]?.caption) return result.captions[0].caption
  if (result.best_caption?.text) return result.best_caption.text

  // Script Studio
  if (result.script?.full_script) return result.script.full_script.substring(0, 150)
  if (result.full_script) return result.full_script.substring(0, 150)

  // A/B Tester
  if (result.winner) return (result.recommendation || result.winner_reason || 'Winner: ' + result.winner).substring(0, 150)

  // Viral Analyzer
  if (result.final_score) return (result.verdict || 'Viral Score: ' + result.final_score + '/100').substring(0, 150)
  if (result.viral_score) return 'Viral Score: ' + result.viral_score + '/100'

  // Trend Radar
  if (result.trends?.[0]?.trend) return result.trends[0].trend + (result.trends[0].how_to_use ? ' — ' + result.trends[0].how_to_use : '')
  if (result.trending_topics?.[0]?.topic) return result.trending_topics[0].topic

  // Competitor Spy
  if (result.competitor_analysis?.content_strategy) return result.competitor_analysis.content_strategy.substring(0, 150)
  if (result.differentiation_strategy) return result.differentiation_strategy.substring(0, 150)
  if (result.action_plan?.[0]) {
    const item = result.action_plan[0]
    return typeof item === 'string' ? item : (item.action || JSON.stringify(item)).substring(0, 150)
  }

  // Steal Video
  if (result.script_template) return result.script_template.substring(0, 150)
  if (result.analysis?.hook_breakdown) return result.analysis.hook_breakdown.substring(0, 150)
  if (result.your_versions?.[0]?.hook) return result.your_versions[0].hook

  // Thread Composer
  if (result.thread?.tweets?.[0]?.content) return result.thread.tweets[0].content
  if (result.tweets?.[0]?.text) return result.tweets[0].text
  if (result.tweets?.[0]?.content) return result.tweets[0].content

  // Carousel Planner
  if (result.carousel?.title) return result.carousel.title
  if (result.slides?.[0]?.headline) return result.slides[0].headline

  // Content Repurposer
  if (result.repurposed?.[0]?.content) return result.repurposed[0].content.substring(0, 150)

  // Content Planner
  if (result.content_pillars) return result.content_pillars.join(', ')
  if (result.strategy?.posting_frequency) return result.strategy.posting_frequency

  // Engagement Booster
  if (result.optimized_versions?.[0]?.version) return result.optimized_versions[0].version.substring(0, 150)
  if (result.engagement_hooks?.[0]) return result.engagement_hooks[0]

  // Posting Optimizer
  if (result.best_times?.[0]) return typeof result.best_times[0] === 'string' ? result.best_times[0] : JSON.stringify(result.best_times[0]).substring(0, 150)
  if (result.optimal_times?.[0]) return typeof result.optimal_times[0] === 'string' ? result.optimal_times[0] : ''

  // Hashtag Research
  if (result.recommended_set?.[0]) return typeof result.recommended_set[0] === 'string' ? result.recommended_set.join(' ') : ''
  if (result.hashtag_sets?.[0]) return typeof result.hashtag_sets[0] === 'string' ? result.hashtag_sets.join(' ') : ''

  // Bio Generator
  if (result.bios?.[0]?.text) return result.bios[0].text
  if (result.best_bio?.text) return result.best_bio.text

  // Video Ideas
  if (result.ideas?.[0]?.title) return result.ideas[0].title + (result.ideas[0].hook ? ' — ' + result.ideas[0].hook : '')

  if (result.video_ideas?.[0]?.title) return result.video_ideas[0].title
  if (result.trending_videos?.[0]?.title) return result.trending_videos[0].title

  // Viral Score
  if (result.optimized_content) return result.optimized_content.substring(0, 150)
  if (result.predicted_score_after) return 'Predicted Score: ' + result.predicted_score_after + '/100'

  // Generic: try to find any string value
  for (const key of Object.keys(result)) {
    const val = result[key]
    if (typeof val === 'string' && val.length > 10 && !key.includes('_id') && key !== 'dna_code') {
      return val.substring(0, 150)
    }
  }

  return ''
}

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
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
        setSession(session)
        fetchLibrary(session.user.id, 1, 'all', false, '')
      }
    })
  }, [router])

  const fetchLibrary = async (userId: string, p: number, tool: string, fav: boolean, q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p.toString() })
      if (tool !== 'all') params.set('tool', tool)
      if (fav) params.set('favorites', 'true')
      if (q) params.set('search', q)

      const s = await supabase.auth.getSession()
      const res = await fetch(`/api/content-library?${params}`, {
        headers: { 'Authorization': `Bearer ${s.data.session?.access_token}` }
      })
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
    const s = await supabase.auth.getSession()
    const res = await fetch('/api/content-library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s.data.session?.access_token}` },
      body: JSON.stringify({ action: 'favorite', contentId })
    })
    if (res.ok) {
      setItems(items.map(item => item.id === contentId ? { ...item, is_favorite: !item.is_favorite } : item))
    }
  }

  const deleteContent = async (contentId: string) => {
    if (!user || !confirm(t.confirmDelete)) return
    const s2 = await supabase.auth.getSession()
    const res = await fetch('/api/content-library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s2.data.session?.access_token}` },
      body: JSON.stringify({ action: 'delete', contentId })
    })
    if (res.ok) {
      setItems(items.filter(item => item.id !== contentId))
      setTotal(total - 1)
    }
  }

  const toolList = ['all', 'hook-generator', 'caption-generator', 'script-studio', 'trend-radar', 'steal-video', 'content-planner', 'viral-analyzer', 'hashtag-research', 'competitor-spy', 'ab-tester', 'carousel-planner', 'thread-composer', 'engagement-booster', 'posting-optimizer', 'content-repurposer', 'viral-score', 'bio-generator', 'video-ideas']

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
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{renderResult(item.result, item.tool_name)}</pre>
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
