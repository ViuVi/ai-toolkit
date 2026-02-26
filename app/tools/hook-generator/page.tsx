'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Hook Generator', subtitle: 'Create attention-grabbing hooks', credits: '2 Credits', topic: 'Topic', placeholder: 'Enter your topic...', quickTopics: 'Quick topics:', generate: 'Generate Hooks', generating: 'Generating...', results: 'Results', copy: 'Copy', copied: 'Copied!', required: 'Please enter a topic', success: 'Hooks generated!', error: 'An error occurred', tips: 'Hook Tips', tip1: 'The first 3 seconds decide everything', tip2: 'Use curiosity gaps', tip3: 'Personal stories work better', tip4: 'Test different hooks', types: { all: '🎯 All', curiosity: '🤔 Curiosity', shocking: '😱 Shocking', question: '❓ Question', story: '📖 Story', statistic: '📊 Statistic' }, examples: ['productivity tips', 'making money online', 'personal growth', 'social media'] },
  tr: { back: '← Panele Dön', title: 'Hook Üretici', subtitle: 'Dikkat çekici hooklar oluştur', credits: '2 Kredi', topic: 'Konu', placeholder: 'Konunuzu girin...', quickTopics: 'Hızlı konular:', generate: 'Hook Oluştur', generating: 'Oluşturuluyor...', results: 'Sonuçlar', copy: 'Kopyala', copied: 'Kopyalandı!', required: 'Lütfen konu girin', success: 'Hooklar oluşturuldu!', error: 'Bir hata oluştu', tips: 'Hook İpuçları', tip1: 'İlk 3 saniye her şeyi belirler', tip2: 'Merak boşlukları kullan', tip3: 'Kişisel hikayeler daha iyi', tip4: 'Farklı hookları test et', types: { all: '🎯 Tümü', curiosity: '🤔 Merak', shocking: '😱 Şok', question: '❓ Soru', story: '📖 Hikaye', statistic: '📊 İstatistik' }, examples: ['verimlilik ipuçları', 'online para kazanma', 'kişisel gelişim', 'sosyal medya'] },
  ru: { back: '← Назад', title: 'Генератор хуков', subtitle: 'Создайте захватывающие хуки', credits: '2 Кредита', topic: 'Тема', placeholder: 'Введите тему...', quickTopics: 'Быстрые темы:', generate: 'Создать хуки', generating: 'Создание...', results: 'Результаты', copy: 'Копировать', copied: 'Скопировано!', required: 'Введите тему', success: 'Хуки созданы!', error: 'Ошибка', tips: 'Советы', tip1: 'Первые 3 секунды решают всё', tip2: 'Используйте интригу', tip3: 'Личные истории работают лучше', tip4: 'Тестируйте разные хуки', types: { all: '🎯 Все', curiosity: '🤔 Интрига', shocking: '😱 Шок', question: '❓ Вопрос', story: '📖 История', statistic: '📊 Статистика' }, examples: ['продуктивность', 'заработок онлайн', 'саморазвитие', 'маркетинг'] },
  de: { back: '← Zurück', title: 'Hook-Generator', subtitle: 'Erstellen Sie aufmerksamkeitsstarke Hooks', credits: '2 Credits', topic: 'Thema', placeholder: 'Thema eingeben...', quickTopics: 'Schnelle Themen:', generate: 'Hooks erstellen', generating: 'Erstellen...', results: 'Ergebnisse', copy: 'Kopieren', copied: 'Kopiert!', required: 'Bitte Thema eingeben', success: 'Hooks erstellt!', error: 'Fehler', tips: 'Hook-Tipps', tip1: 'Die ersten 3 Sekunden entscheiden', tip2: 'Nutzen Sie Neugier', tip3: 'Persönliche Geschichten funktionieren besser', tip4: 'Testen Sie verschiedene Hooks', types: { all: '🎯 Alle', curiosity: '🤔 Neugier', shocking: '😱 Schock', question: '❓ Frage', story: '📖 Geschichte', statistic: '📊 Statistik' }, examples: ['Produktivität', 'Online Geld verdienen', 'Persönliches Wachstum', 'Social Media'] },
  fr: { back: '← Retour', title: 'Générateur de hooks', subtitle: 'Créez des hooks accrocheurs', credits: '2 Crédits', topic: 'Sujet', placeholder: 'Entrez votre sujet...', quickTopics: 'Sujets rapides:', generate: 'Générer des hooks', generating: 'Génération...', results: 'Résultats', copy: 'Copier', copied: 'Copié!', required: 'Veuillez entrer un sujet', success: 'Hooks générés!', error: 'Erreur', tips: 'Conseils', tip1: 'Les 3 premières secondes décident tout', tip2: 'Utilisez la curiosité', tip3: 'Les histoires personnelles fonctionnent mieux', tip4: 'Testez différents hooks', types: { all: '🎯 Tous', curiosity: '🤔 Curiosité', shocking: '😱 Choc', question: '❓ Question', story: '📖 Histoire', statistic: '📊 Statistique' }, examples: ['productivité', 'gagner en ligne', 'développement personnel', 'marketing'] }
}

const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState(''); const [hooks, setHooks] = useState<any[]>([]); const [loading, setLoading] = useState(false); const [userId, setUserId] = useState<string | null>(null); const [copied, setCopied] = useState<number | null>(null); const [filter, setFilter] = useState<string>('all')
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]

  useEffect(() => { async function getUser() { const { data: { user } } = await supabase.auth.getUser(); if (user) setUserId(user.id) } getUser() }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.required, 'warning'); return }
    setLoading(true); setHooks([])
    try {
      const response = await fetch('/api/hook-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, userId, language }) })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') } else { setHooks(data.hooks); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (index: number, text: string) => { navigator.clipboard.writeText(text); setCopied(index); showToast(t.copied, 'success'); setTimeout(() => setCopied(null), 2000) }
  const filteredHooks = filter === 'all' ? hooks : hooks.filter(h => h.type === filter)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}>{lang.flag}</button>))}</div>
            <span className="text-2xl">🎣</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-4"><span className="text-yellow-400 text-sm">{t.credits}</span></div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{t.topic}</label>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full h-24 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none transition" placeholder={t.placeholder} />
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">{t.quickTopics}</p>
            <div className="flex flex-wrap gap-2">{t.examples.map((ex: string, i: number) => (<button key={i} onClick={() => setTopic(ex)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition">{ex}</button>))}</div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-black mb-6">
          {loading ? <><span className="animate-spin">⏳</span> {t.generating}</> : <>🎣 {t.generate}</>}
        </button>

        {hooks.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">{Object.entries(t.types).map(([key, label]) => (<button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-sm transition ${filter === key ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{label as string}</button>))}</div>
            <h2 className="text-xl font-semibold mb-4">{t.results}</h2>
            <div className="space-y-4">
              {filteredHooks.map((hook, index) => (
                <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-yellow-500/50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2"><span className="text-xl">{hook.emoji}</span><span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">{hook.type}</span></div>
                      <p className="text-lg text-white mb-2">"{hook.text}"</p>
                      <p className="text-sm text-gray-400">💡 {hook.reason}</p>
                    </div>
                    <button onClick={() => handleCopy(index, hook.text)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition shrink-0">{copied === index ? '✓' : '📋'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">💡 {t.tips}</h3>
          <ul className="text-gray-400 text-sm space-y-2"><li>• {t.tip1}</li><li>• {t.tip2}</li><li>• {t.tip3}</li><li>• {t.tip4}</li></ul>
        </div>
      </main>
    </div>
  )
}
