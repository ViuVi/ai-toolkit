'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Link in Bio Builder', subtitle: 'Profesyonel bio sayfa oluştur', displayName: 'Görünen Ad', displayNamePh: 'örn: Ahmet Yılmaz', bio: 'Bio / Açıklama', bioPlaceholder: 'Kısa bir açıklama...', links: 'Bağlantılar', addLink: '+ Bağlantı Ekle', linkTitle: 'Başlık', linkUrl: 'URL', theme: 'Tema', preview: 'Önizleme', downloadHtml: 'HTML İndir', copyHtml: 'HTML Kopyala', copied: 'Kopyalandı!', free: 'ÜCRETSİZ', avatar: 'Profil Fotoğrafı URL', avatarPh: 'https://...', emptyTitle: 'Link in Bio Builder', emptyDesc: 'Bilgilerinizi girin, profesyonel bio sayfa oluşturun', remove: 'Sil' },
  en: { title: 'Link in Bio Builder', subtitle: 'Create a professional bio page', displayName: 'Display Name', displayNamePh: 'e.g: John Doe', bio: 'Bio / Description', bioPlaceholder: 'A short description...', links: 'Links', addLink: '+ Add Link', linkTitle: 'Title', linkUrl: 'URL', theme: 'Theme', preview: 'Preview', downloadHtml: 'Download HTML', copyHtml: 'Copy HTML', copied: 'Copied!', free: 'FREE', avatar: 'Profile Photo URL', avatarPh: 'https://...', emptyTitle: 'Link in Bio Builder', emptyDesc: 'Enter your info to create a professional bio page', remove: 'Remove' },
  ru: { title: 'Link in Bio Builder', subtitle: 'Создайте профессиональную bio-страницу', displayName: 'Имя', displayNamePh: 'напр: Иван', bio: 'Описание', bioPlaceholder: 'Краткое описание...', links: 'Ссылки', addLink: '+ Добавить', linkTitle: 'Название', linkUrl: 'URL', theme: 'Тема', preview: 'Предпросмотр', downloadHtml: 'Скачать HTML', copyHtml: 'Копировать HTML', copied: 'Скопировано!', free: 'БЕСПЛАТНО', avatar: 'URL фото', avatarPh: 'https://...', emptyTitle: 'Link in Bio Builder', emptyDesc: 'Введите данные', remove: 'Удалить' },
  de: { title: 'Link in Bio Builder', subtitle: 'Erstellen Sie eine professionelle Bio-Seite', displayName: 'Anzeigename', displayNamePh: 'z.B: Max Müller', bio: 'Beschreibung', bioPlaceholder: 'Kurze Beschreibung...', links: 'Links', addLink: '+ Link hinzufügen', linkTitle: 'Titel', linkUrl: 'URL', theme: 'Thema', preview: 'Vorschau', downloadHtml: 'HTML herunterladen', copyHtml: 'HTML kopieren', copied: 'Kopiert!', free: 'KOSTENLOS', avatar: 'Profilbild URL', avatarPh: 'https://...', emptyTitle: 'Link in Bio Builder', emptyDesc: 'Daten eingeben', remove: 'Entfernen' },
  fr: { title: 'Link in Bio Builder', subtitle: 'Créez une page bio professionnelle', displayName: 'Nom affiché', displayNamePh: 'ex: Jean Dupont', bio: 'Description', bioPlaceholder: 'Une courte description...', links: 'Liens', addLink: '+ Ajouter un lien', linkTitle: 'Titre', linkUrl: 'URL', theme: 'Thème', preview: 'Aperçu', downloadHtml: 'Télécharger HTML', copyHtml: 'Copier HTML', copied: 'Copié!', free: 'GRATUIT', avatar: 'URL photo de profil', avatarPh: 'https://...', emptyTitle: 'Link in Bio Builder', emptyDesc: 'Entrez vos infos', remove: 'Supprimer' }
}

const themes = [
  { id: 'dark', name: 'Dark', bg: '#0a0a0f', card: '#1a1a2e', text: '#ffffff', accent: '#a855f7', link: '#7c3aed' },
  { id: 'light', name: 'Light', bg: '#f8fafc', card: '#ffffff', text: '#1e293b', accent: '#7c3aed', link: '#6d28d9' },
  { id: 'ocean', name: 'Ocean', bg: '#0c1222', card: '#162033', text: '#e2e8f0', accent: '#38bdf8', link: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset', bg: '#1a0a0a', card: '#2e1a1a', text: '#fef2f2', accent: '#f97316', link: '#ea580c' },
  { id: 'forest', name: 'Forest', bg: '#0a1a0a', card: '#1a2e1a', text: '#f0fdf4', accent: '#22c55e', link: '#16a34a' },
  { id: 'neon', name: 'Neon', bg: '#0a0a0a', card: '#1a1a1a', text: '#f0f0f0', accent: '#00ff88', link: '#00cc6a' },
]

const socialIcons: Record<string, string> = {
  'instagram.com': '📸', 'tiktok.com': '🎵', 'youtube.com': '🎬', 'twitter.com': '🐦', 'x.com': '🐦',
  'linkedin.com': '💼', 'github.com': '💻', 'spotify.com': '🎧', 'twitch.tv': '🎮',
  'discord.gg': '💬', 'wa.me': '💬', 't.me': '✈️', 'facebook.com': '👤',
}

function getIconForUrl(url: string): string {
  for (const [domain, icon] of Object.entries(socialIcons)) {
    if (url.includes(domain)) return icon
  }
  return '🔗'
}

function generateHtml(name: string, bio: string, avatar: string, links: {title: string, url: string}[], theme: typeof themes[0]): string {
  const linksHtml = links.filter(l => l.title && l.url).map(l => `
    <a href="${l.url}" target="_blank" rel="noopener" style="display:block;padding:16px 24px;margin:8px 0;background:${theme.card};border:1px solid ${theme.accent}30;border-radius:12px;color:${theme.text};text-decoration:none;font-weight:500;text-align:center;transition:all 0.2s;font-size:15px;" onmouseover="this.style.background='${theme.accent}20';this.style.borderColor='${theme.accent}'" onmouseout="this.style.background='${theme.card}';this.style.borderColor='${theme.accent}30'">
      ${getIconForUrl(l.url)} ${l.title}
    </a>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Links</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:${theme.bg}; color:${theme.text}; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
    .container { max-width:420px; width:100%; }
    .avatar { width:96px; height:96px; border-radius:50%; object-fit:cover; border:3px solid ${theme.accent}; margin:0 auto 16px; display:block; }
    .name { font-size:24px; font-weight:700; text-align:center; margin-bottom:8px; }
    .bio { font-size:14px; text-align:center; opacity:0.7; margin-bottom:32px; line-height:1.5; }
    .footer { text-align:center; margin-top:40px; font-size:11px; opacity:0.3; }
    .footer a { color:${theme.accent}; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    ${avatar ? `<img src="${avatar}" alt="${name}" class="avatar">` : `<div style="width:96px;height:96px;border-radius:50%;background:${theme.accent}30;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:40px;border:3px solid ${theme.accent}">${name.charAt(0).toUpperCase()}</div>`}
    <h1 class="name">${name}</h1>
    ${bio ? `<p class="bio">${bio}</p>` : ''}
    ${linksHtml}
    <p class="footer">Powered by <a href="https://mediatoolkit.site">MediaToolkit</a></p>
  </div>
</body>
</html>`
}

export default function LinkInBioPage() {
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [links, setLinks] = useState([{ title: '', url: '' }, { title: '', url: '' }, { title: '', url: '' }])
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [htmlCopied, setHtmlCopied] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })
  }, [router])

  const addLink = () => setLinks([...links, { title: '', url: '' }])

  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...links]
    updated[index][field] = value
    setLinks(updated)
  }

  const removeLink = (index: number) => {
    if (links.length > 1) setLinks(links.filter((_, i) => i !== index))
  }

  const downloadHtml = () => {
    const html = generateHtml(displayName, bio, avatar, links, selectedTheme)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${displayName.replace(/\s+/g, '-').toLowerCase() || 'link-in-bio'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyHtml = () => {
    const html = generateHtml(displayName, bio, avatar, links, selectedTheme)
    navigator.clipboard.writeText(html)
    setHtmlCopied(true)
    setTimeout(() => setHtmlCopied(false), 2000)
  }

  const hasContent = displayName.trim() || links.some(l => l.title && l.url)

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🔗 {t.title}</h1>
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-bold">{t.free}</span>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
            <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.displayName}</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t.displayNamePh} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.bio}</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t.bioPlaceholder} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.avatar}</label>
                <input type="url" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder={t.avatarPh} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm" />
              </div>

              {/* Links */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.links}</label>
                <div className="space-y-3">
                  {links.map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex-1 space-y-1.5">
                        <input type="text" value={link.title} onChange={e => updateLink(i, 'title', e.target.value)} placeholder={`${t.linkTitle} ${i + 1}`} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm" />
                        <input type="url" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder={`${t.linkUrl}`} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm" />
                      </div>
                      <button onClick={() => removeLink(i)} className="px-2 text-gray-500 hover:text-red-400 transition self-center text-sm">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={addLink} className="w-full mt-3 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition">{t.addLink}</button>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.theme}</label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map(theme => (
                    <button key={theme.id} onClick={() => setSelectedTheme(theme)} className={`p-3 rounded-xl border text-xs text-center transition ${selectedTheme.id === theme.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                      <div className="flex gap-1 justify-center mb-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: theme.bg, border: '1px solid #333' }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ background: theme.accent }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ background: theme.text }}></div>
                      </div>
                      <span className="text-gray-400">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Download / Copy */}
              {hasContent && (
                <div className="flex gap-3">
                  <button onClick={downloadHtml} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2">📥 {t.downloadHtml}</button>
                  <button onClick={copyHtml} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">{htmlCopied ? `✓ ${t.copied}` : `📋 ${t.copyHtml}`}</button>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            {!hasContent ? (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3>
                <p className="text-gray-500">{t.emptyDesc}</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                {/* Phone Frame */}
                <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-500">{t.preview}</span>
                  <div className="w-12"></div>
                </div>

                {/* Page Content */}
                <div className="p-8 flex justify-center min-h-[500px]" style={{ background: selectedTheme.bg }}>
                  <div className="w-full max-w-[360px] py-8">
                    {/* Avatar */}
                    {avatar ? (
                      <img src={avatar} alt={displayName} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" style={{ border: `3px solid ${selectedTheme.accent}` }} />
                    ) : displayName && (
                      <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold" style={{ background: `${selectedTheme.accent}30`, border: `3px solid ${selectedTheme.accent}`, color: selectedTheme.accent }}>
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Name */}
                    {displayName && <h2 className="text-2xl font-bold text-center mb-2" style={{ color: selectedTheme.text }}>{displayName}</h2>}

                    {/* Bio */}
                    {bio && <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: selectedTheme.text, opacity: 0.7 }}>{bio}</p>}

                    {/* Links */}
                    <div className="space-y-3">
                      {links.filter(l => l.title && l.url).map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block py-4 px-6 rounded-xl text-center font-medium text-sm transition hover:scale-[1.02]" style={{ background: selectedTheme.card, border: `1px solid ${selectedTheme.accent}30`, color: selectedTheme.text }}>
                          {getIconForUrl(link.url)} {link.title}
                        </a>
                      ))}
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-10 text-xs" style={{ color: selectedTheme.text, opacity: 0.3 }}>
                      Powered by MediaToolkit
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
