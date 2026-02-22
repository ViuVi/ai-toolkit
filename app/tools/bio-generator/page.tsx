'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

export default function BioGeneratorPage() {
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
  const [bios, setBios] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  const handleGenerate = async () => {
    if (!name.trim() || !profession.trim()) {
      showToast(language === 'en' ? 'Name and profession required' : 'İsim ve meslek gerekli', 'warning')
      return
    }

    setLoading(true)
    setBios([])

    try {
      const response = await fetch('/api/bio-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profession, interests, platform, tone, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setBios(data.bios)
        showToast(language === 'en' ? 'Bios generated!' : 'Biolar oluşturuldu!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  const copyBio = (bio: string, index: number) => {
    navigator.clipboard.writeText(bio)
    setCopiedIndex(index)
    showToast(language === 'en' ? 'Copied!' : 'Kopyalandı!', 'success')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">💫</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '💫 FREE TOOL' : '💫 ÜCRETSİZ ARAÇ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Bio Generator' : 'Bio Generator'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Professional bios for social media profiles' : 'Sosyal medya profilleri için profesyonel biolar'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Name' : 'İsim'}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Profession' : 'Meslek'}</label>
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder={language === 'en' ? 'Software Developer' : 'Yazılım Geliştirici'} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Interests (Optional)' : 'İlgi Alanları (Opsiyonel)'}</label>
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none" placeholder={language === 'en' ? 'Travel, Photography, Coffee' : 'Seyahat, Fotoğraf, Kahve'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none">
                <option value="instagram">📸 Instagram</option>
                <option value="twitter">🐦 Twitter</option>
                <option value="linkedin">💼 LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Tone' : 'Ton'}</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none">
                <option value="casual">{language === 'en' ? 'Casual' : 'Gündelik'}</option>
                <option value="professional">{language === 'en' ? 'Professional' : 'Profesyonel'}</option>
                <option value="creative">{language === 'en' ? 'Creative' : 'Yaratıcı'}</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>💫 {language === 'en' ? 'Generate Bios' : 'Bio Oluştur'}</>}
        </button>

        {bios.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {bios.map((bio, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">Bio {index + 1}</h3>
                  <button onClick={() => copyBio(bio, index)} className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm transition">
                    {copiedIndex === index ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                  </button>
                </div>
                <p className="text-white text-lg">{bio}</p>
                <div className="mt-3 text-xs text-gray-500">
                  {bio.length} {language === 'en' ? 'characters' : 'karakter'}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}