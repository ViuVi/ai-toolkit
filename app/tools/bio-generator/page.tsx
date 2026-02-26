'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Bio Generator', subtitle: 'Create professional bios', free: '💫 FREE', name: 'Name', namePlaceholder: 'John Doe', profession: 'Profession', professionPlaceholder: 'Software Developer', interests: 'Interests', interestsPlaceholder: 'Travel, Photography', platform: 'Platform', tone: 'Tone', generate: 'Generate Bios', generating: 'Generating...', results: 'Generated Bios', copy: 'Copy', copied: 'Copied!', required: 'Name and profession required', success: 'Bios generated!', error: 'An error occurred', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, tones: { professional: 'Professional', casual: 'Casual', creative: 'Creative', funny: 'Funny' } },
  tr: { back: '← Panele Dön', title: 'Bio Üretici', subtitle: 'Profesyonel biolar oluştur', free: '💫 ÜCRETSİZ', name: 'İsim', namePlaceholder: 'Ahmet Yılmaz', profession: 'Meslek', professionPlaceholder: 'Yazılım Geliştirici', interests: 'İlgi Alanları', interestsPlaceholder: 'Seyahat, Fotoğraf', platform: 'Platform', tone: 'Ton', generate: 'Bio Oluştur', generating: 'Oluşturuluyor...', results: 'Oluşturulan Biolar', copy: 'Kopyala', copied: 'Kopyalandı!', required: 'İsim ve meslek gerekli', success: 'Biolar oluşturuldu!', error: 'Hata oluştu', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, tones: { professional: 'Profesyonel', casual: 'Günlük', creative: 'Yaratıcı', funny: 'Eğlenceli' } },
  ru: { back: '← Назад', title: 'Генератор био', subtitle: 'Создайте профессиональные био', free: '💫 БЕСПЛАТНО', name: 'Имя', namePlaceholder: 'Иван Иванов', profession: 'Профессия', professionPlaceholder: 'Разработчик', interests: 'Интересы', interestsPlaceholder: 'Путешествия, Фото', platform: 'Платформа', tone: 'Тон', generate: 'Создать био', generating: 'Создание...', results: 'Созданные био', copy: 'Копировать', copied: 'Скопировано!', required: 'Имя и профессия обязательны', success: 'Био созданы!', error: 'Ошибка', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, tones: { professional: 'Профессиональный', casual: 'Повседневный', creative: 'Креативный', funny: 'Смешной' } },
  de: { back: '← Zurück', title: 'Bio-Generator', subtitle: 'Erstellen Sie professionelle Bios', free: '💫 KOSTENLOS', name: 'Name', namePlaceholder: 'Max Mustermann', profession: 'Beruf', professionPlaceholder: 'Softwareentwickler', interests: 'Interessen', interestsPlaceholder: 'Reisen, Fotografie', platform: 'Plattform', tone: 'Ton', generate: 'Bio erstellen', generating: 'Erstellen...', results: 'Erstellte Bios', copy: 'Kopieren', copied: 'Kopiert!', required: 'Name und Beruf erforderlich', success: 'Bios erstellt!', error: 'Fehler', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, tones: { professional: 'Professionell', casual: 'Locker', creative: 'Kreativ', funny: 'Lustig' } },
  fr: { back: '← Retour', title: 'Générateur de bio', subtitle: 'Créez des bios professionnelles', free: '💫 GRATUIT', name: 'Nom', namePlaceholder: 'Jean Dupont', profession: 'Profession', professionPlaceholder: 'Développeur', interests: 'Intérêts', interestsPlaceholder: 'Voyage, Photo', platform: 'Plateforme', tone: 'Ton', generate: 'Générer des bios', generating: 'Génération...', results: 'Bios générées', copy: 'Copier', copied: 'Copié!', required: 'Nom et profession requis', success: 'Bios générées!', error: 'Erreur', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, tones: { professional: 'Professionnel', casual: 'Décontracté', creative: 'Créatif', funny: 'Drôle' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function BioGeneratorPage() {
  const [name, setName] = useState(''); const [profession, setProfession] = useState(''); const [interests, setInterests] = useState(''); const [platform, setPlatform] = useState('instagram'); const [tone, setTone] = useState('professional'); const [bios, setBios] = useState<string[]>([]); const [loading, setLoading] = useState(false); const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]

  const handleGenerate = async () => {
    if (!name || !profession) { showToast(t.required, 'warning'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/bio-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, profession, interests, platform, tone, language }) })
      const data = await res.json()
      if (data.bios) { setBios(data.bios); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const copyBio = (bio: string, index: number) => { navigator.clipboard.writeText(bio); setCopiedIndex(index); showToast(t.copied, 'success'); setTimeout(() => setCopiedIndex(null), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div>
            <span className="text-2xl">👤</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mb-4">{t.free}</span>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium mb-2">{t.name}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium mb-2">{t.profession}</label><input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder={t.professionPlaceholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">{t.interests}</label><input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder={t.interestsPlaceholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-2">{t.tone}</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.tones).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>

        {bios.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t.results}</h2>
            {bios.map((bio, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 flex justify-between items-start gap-4">
                <p className="flex-1">{bio}</p>
                <button onClick={() => copyBio(bio, index)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition">{copiedIndex === index ? t.copied : t.copy}</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
