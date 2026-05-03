'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const languageNames: Record<string, string> = {
  en: '🇺🇸 English',
  tr: '🇹🇷 Türkçe',
  ru: '🇷🇺 Русский',
  de: '🇩🇪 Deutsch',
  fr: '🇫🇷 Français'
}

// Çeviriler
const texts: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    credits: 'Credits',
    tools: 'AI Tools',
    logout: 'Logout',
    watchAd: 'Watch Ad',
    watchAdDesc: 'Watch a short ad to earn credits',
    dailyBonus: 'Daily Bonus',
    dailyBonusDesc: 'Claim your free daily credits!',
    dailyClaimed: 'Already claimed today',
    claimBonus: 'Claim +10',
    bonusClaimed: 'Claimed! +10 credits',
    comeBackTomorrow: 'Come back tomorrow!',
    streak: 'Day Streak',
    watching: 'Watching Ad...',
    remaining: 'seconds remaining',
    complete: '+10 Credits Added!',
    cancel: 'Cancel',
    changePhoto: 'Change Photo',
    uploadPhoto: 'Upload Photo',
    uploading: 'Uploading...',
    removePhoto: 'Remove Photo',
    uploadError: 'Upload failed',
    uploadSuccess: 'Photo updated',
    photoRemoved: 'Photo removed',
    readyToCreate: 'Ready to create viral content?',
    allTools: 'All Tools',
    create: 'Create',
    analyze: 'Analyze',
    optimize: 'Optimize',
    stats: 'Your Stats',
    totalUses: 'Total Uses',
    creditsSpent: 'Credits Spent',
    thisMonth: 'This Month',
    recentActivity: 'Recent Activity',
    weeklyUsage: 'Weekly Usage',
    noActivity: 'No activity yet',
    usedTool: 'Used',
    referral: 'Invite Friends',
    referralDesc: 'Share your code & earn 50 credits for each friend!',
    yourCode: 'Your Code',
    copyCode: 'Copy',
    codeCopied: 'Copied!',
    friendsInvited: 'Friends Invited',
    creditsEarned: 'Credits Earned',
    shareOn: 'Share on'
  },
  tr: {
    welcome: 'Hoş Geldin',
    credits: 'Kredi',
    tools: 'AI Araçları',
    logout: 'Çıkış',
    watchAd: 'Reklam İzle',
    watchAdDesc: 'Kredi kazanmak için reklam izle',
    dailyBonus: 'Günlük Bonus',
    dailyBonusDesc: 'Ücretsiz günlük kredilerinizi alın!',
    dailyClaimed: 'Bugün zaten alındı',
    claimBonus: '+10 Al',
    bonusClaimed: 'Alındı! +10 kredi',
    comeBackTomorrow: 'Yarın tekrar gelin!',
    streak: 'Gün Serisi',
    watching: 'Reklam İzleniyor...',
    remaining: 'saniye kaldı',
    complete: '+10 Kredi Eklendi!',
    cancel: 'İptal',
    changePhoto: 'Fotoğraf Değiştir',
    uploadPhoto: 'Fotoğraf Yükle',
    uploading: 'Yükleniyor...',
    removePhoto: 'Fotoğrafı Kaldır',
    uploadError: 'Yükleme hatası',
    uploadSuccess: 'Fotoğraf güncellendi',
    photoRemoved: 'Fotoğraf kaldırıldı',
    readyToCreate: 'Viral içerik oluşturmaya hazır mısın?',
    allTools: 'Tüm Araçlar',
    create: 'Oluştur',
    analyze: 'Analiz',
    optimize: 'Optimize',
    stats: 'İstatistiklerin',
    totalUses: 'Toplam Kullanım',
    creditsSpent: 'Harcanan Kredi',
    thisMonth: 'Bu Ay',
    recentActivity: 'Son Aktivite',
    weeklyUsage: 'Haftalık Kullanım',
    noActivity: 'Henüz aktivite yok',
    usedTool: 'Kullanıldı',
    referral: 'Arkadaşını Davet Et',
    referralDesc: 'Kodunu paylaş, her arkadaş için 50 kredi kazan!',
    yourCode: 'Senin Kodun',
    copyCode: 'Kopyala',
    codeCopied: 'Kopyalandı!',
    friendsInvited: 'Davet Edilen',
    creditsEarned: 'Kazanılan Kredi',
    shareOn: 'Paylaş'
  },
  ru: {
    welcome: 'Добро пожаловать',
    credits: 'Кредиты',
    tools: 'AI Инструменты',
    logout: 'Выход',
    watchAd: 'Смотреть рекламу',
    watchAdDesc: 'Смотрите рекламу для кредитов',
    dailyBonus: 'Ежедневный бонус',
    dailyBonusDesc: 'Получите бесплатные кредиты!',
    dailyClaimed: 'Уже получено сегодня',
    claimBonus: 'Получить +10',
    bonusClaimed: 'Получено! +10 кредитов',
    comeBackTomorrow: 'Приходите завтра!',
    streak: 'Дней подряд',
    watching: 'Просмотр рекламы...',
    remaining: 'секунд осталось',
    complete: '+10 Кредитов!',
    cancel: 'Отмена',
    changePhoto: 'Изменить фото',
    uploadPhoto: 'Загрузить',
    uploading: 'Загрузка...',
    removePhoto: 'Удалить фото',
    uploadError: 'Ошибка загрузки',
    uploadSuccess: 'Фото обновлено',
    photoRemoved: 'Фото удалено',
    readyToCreate: 'Готовы создавать вирусный контент?',
    allTools: 'Все',
    create: 'Создать',
    analyze: 'Анализ',
    optimize: 'Оптимизация',
    stats: 'Ваша статистика',
    totalUses: 'Всего использований',
    creditsSpent: 'Потрачено кредитов',
    thisMonth: 'В этом месяце',
    recentActivity: 'Недавняя активность',
    weeklyUsage: 'За неделю',
    noActivity: 'Пока нет активности',
    usedTool: 'Использовано',
    referral: 'Пригласить друзей',
    referralDesc: 'Поделитесь кодом и получите 50 кредитов за друга!',
    yourCode: 'Ваш код',
    copyCode: 'Копировать',
    codeCopied: 'Скопировано!',
    friendsInvited: 'Приглашено',
    creditsEarned: 'Заработано',
    shareOn: 'Поделиться'
  },
  de: {
    welcome: 'Willkommen',
    credits: 'Credits',
    tools: 'AI Tools',
    logout: 'Abmelden',
    watchAd: 'Werbung ansehen',
    watchAdDesc: 'Werbung ansehen für Credits',
    dailyBonus: 'Täglicher Bonus',
    dailyBonusDesc: 'Holen Sie sich Ihre Credits!',
    dailyClaimed: 'Heute bereits abgeholt',
    claimBonus: '+10 abholen',
    bonusClaimed: 'Abgeholt! +10 Credits',
    comeBackTomorrow: 'Kommen Sie morgen wieder!',
    streak: 'Tage Serie',
    watching: 'Werbung läuft...',
    remaining: 'Sekunden übrig',
    complete: '+10 Credits!',
    cancel: 'Abbrechen',
    changePhoto: 'Foto ändern',
    uploadPhoto: 'Hochladen',
    uploading: 'Lädt...',
    removePhoto: 'Foto entfernen',
    uploadError: 'Upload fehlgeschlagen',
    uploadSuccess: 'Foto aktualisiert',
    photoRemoved: 'Foto entfernt',
    readyToCreate: 'Bereit viralen Content zu erstellen?',
    allTools: 'Alle',
    create: 'Erstellen',
    analyze: 'Analysieren',
    optimize: 'Optimieren',
    stats: 'Deine Statistiken',
    totalUses: 'Gesamtnutzung',
    creditsSpent: 'Credits verbraucht',
    thisMonth: 'Diesen Monat',
    recentActivity: 'Letzte Aktivität',
    weeklyUsage: 'Wöchentliche Nutzung',
    noActivity: 'Noch keine Aktivität',
    usedTool: 'Verwendet',
    referral: 'Freunde einladen',
    referralDesc: 'Teile deinen Code & erhalte 50 Credits pro Freund!',
    yourCode: 'Dein Code',
    copyCode: 'Kopieren',
    codeCopied: 'Kopiert!',
    friendsInvited: 'Eingeladen',
    creditsEarned: 'Verdient',
    shareOn: 'Teilen auf'
  },
  fr: {
    welcome: 'Bienvenue',
    credits: 'Crédits',
    tools: 'Outils IA',
    logout: 'Déconnexion',
    watchAd: 'Voir la pub',
    watchAdDesc: 'Regardez une pub pour des crédits',
    dailyBonus: 'Bonus quotidien',
    dailyBonusDesc: 'Réclamez vos crédits gratuits!',
    dailyClaimed: 'Déjà réclamé aujourd\'hui',
    claimBonus: 'Réclamer +10',
    bonusClaimed: 'Réclamé! +10 crédits',
    comeBackTomorrow: 'Revenez demain!',
    streak: 'Jours consécutifs',
    watching: 'Pub en cours...',
    remaining: 'secondes restantes',
    complete: '+10 Crédits!',
    cancel: 'Annuler',
    changePhoto: 'Changer la photo',
    uploadPhoto: 'Télécharger',
    uploading: 'Téléchargement...',
    removePhoto: 'Supprimer',
    uploadError: 'Échec du téléchargement',
    uploadSuccess: 'Photo mise à jour',
    photoRemoved: 'Photo supprimée',
    readyToCreate: 'Prêt à créer du contenu viral?',
    allTools: 'Tous',
    create: 'Créer',
    analyze: 'Analyser',
    optimize: 'Optimiser',
    stats: 'Vos statistiques',
    totalUses: 'Utilisations totales',
    creditsSpent: 'Crédits dépensés',
    thisMonth: 'Ce mois-ci',
    recentActivity: 'Activité récente',
    weeklyUsage: 'Utilisation hebdomadaire',
    noActivity: 'Pas encore d\'activité',
    usedTool: 'Utilisé',
    referral: 'Inviter des amis',
    referralDesc: 'Partagez votre code et gagnez 50 crédits par ami!',
    yourCode: 'Votre code',
    copyCode: 'Copier',
    codeCopied: 'Copié!',
    friendsInvited: 'Amis invités',
    creditsEarned: 'Crédits gagnés',
    shareOn: 'Partager sur'
  }
}

// Tool isimleri
const toolNames: Record<string, Record<string, { name: string; desc: string }>> = {
  en: {
    hookGenerator: { name: 'Hook Generator', desc: 'Create viral hooks' },
    captionGenerator: { name: 'Caption Generator', desc: 'Write engaging captions' },
    scriptStudio: { name: 'Script Studio', desc: 'Write video scripts' },
    viralAnalyzer: { name: 'Viral Analyzer', desc: 'Analyze viral potential' },
    stealVideo: { name: 'Steal This Video', desc: 'Reverse engineer viral content' },
    linkInBio: { name: 'Link in Bio Builder', desc: 'Free bio page creator' },
    trendRadar: { name: 'Trend Radar', desc: 'Discover trends' },
    competitorSpy: { name: 'Competitor Spy', desc: 'Analyze competitors' },
    hashtagResearch: { name: 'Hashtag Research', desc: 'Find best hashtags' },
    contentPlanner: { name: 'Content Planner', desc: '30-day content calendar' },
    contentRepurposer: { name: 'Content Repurposer', desc: 'Repurpose your content' },
    abTester: { name: 'A/B Tester', desc: 'Compare content versions' },
    carouselPlanner: { name: 'Carousel Planner', desc: 'Plan carousel posts' },
    engagementBooster: { name: 'Engagement Booster', desc: 'Boost engagement' },
    postingOptimizer: { name: 'Posting Optimizer', desc: 'Best posting times' },
    threadComposer: { name: 'Thread Composer', desc: 'Write Twitter threads' },
    viralScore: { name: 'Viral Score Predictor', desc: 'Real-time viral scoring' },
    bioGenerator: { name: 'Bio Generator', desc: 'Platform-perfect bios' },
    videoIdeas: { name: 'Video Idea Generator', desc: 'Shoot-ready video ideas' },
    qrGenerator: { name: 'QR Code Generator', desc: 'Free custom QR codes' }
  },
  tr: {
    hookGenerator: { name: 'Hook Üretici', desc: 'Viral hooklar oluştur' },
    captionGenerator: { name: 'Açıklama Üretici', desc: 'Etkileyici açıklamalar yaz' },
    scriptStudio: { name: 'Script Stüdyosu', desc: 'Video scriptleri yaz' },
    viralAnalyzer: { name: 'Viral Analizci', desc: 'Viral potansiyeli analiz et' },
    stealVideo: { name: 'Bu Videoyu Çal', desc: 'Viral içerikleri analiz et' },
    linkInBio: { name: 'Link in Bio Builder', desc: 'Ücretsiz bio sayfası oluştur' },
    trendRadar: { name: 'Trend Radarı', desc: 'Trendleri keşfet' },
    competitorSpy: { name: 'Rakip Casusluğu', desc: 'Rakipleri analiz et' },
    hashtagResearch: { name: 'Hashtag Araştırma', desc: 'En iyi hashtagleri bul' },
    contentPlanner: { name: 'İçerik Planlayıcı', desc: '30 günlük içerik takvimi' },
    contentRepurposer: { name: 'İçerik Dönüştürücü', desc: 'İçeriklerini dönüştür' },
    abTester: { name: 'A/B Test', desc: 'İçerik versiyonlarını karşılaştır' },
    carouselPlanner: { name: 'Carousel Planlayıcı', desc: 'Carousel postları planla' },
    engagementBooster: { name: 'Etkileşim Arttırıcı', desc: 'Etkileşimi arttır' },
    postingOptimizer: { name: 'Paylaşım Zamanı', desc: 'En iyi paylaşım saatleri' },
    threadComposer: { name: 'Thread Yazarı', desc: 'Twitter threadleri yaz' },
    viralScore: { name: 'Viral Skor Tahmincisi', desc: 'Anlık viral skor hesapla' },
    bioGenerator: { name: 'Bio Üretici', desc: 'Platform bazlı bio yaz' },
    videoIdeas: { name: 'Video Fikir Üretici', desc: 'Çekilmeye hazır fikirler' },
    qrGenerator: { name: 'QR Kod Oluşturucu', desc: 'Ücretsiz özel QR kodlar' }
  },
  ru: {
    hookGenerator: { name: 'Генератор Хуков', desc: 'Создайте вирусные хуки' },
    captionGenerator: { name: 'Генератор Подписей', desc: 'Пишите подписи' },
    scriptStudio: { name: 'Студия Скриптов', desc: 'Пишите скрипты' },
    viralAnalyzer: { name: 'Вирусный Анализатор', desc: 'Анализ потенциала' },
    stealVideo: { name: 'Украсть Видео', desc: 'Анализ контента' },
    linkInBio: { name: 'Link in Bio Builder', desc: 'Бесплатная bio-страница' },
    trendRadar: { name: 'Радар Трендов', desc: 'Откройте тренды' },
    competitorSpy: { name: 'Шпион Конкурентов', desc: 'Анализ конкурентов' },
    hashtagResearch: { name: 'Исследование Хештегов', desc: 'Лучшие хештеги' },
    contentPlanner: { name: 'Планировщик Контента', desc: '30-дневный календарь' },
    contentRepurposer: { name: 'Переработка Контента', desc: 'Переработка' },
    abTester: { name: 'A/B Тестер', desc: 'Сравнение версий' },
    carouselPlanner: { name: 'Планер Каруселей', desc: 'Планируйте посты' },
    engagementBooster: { name: 'Усилитель Вовлечения', desc: 'Увеличьте охват' },
    postingOptimizer: { name: 'Оптимизатор Постинга', desc: 'Лучшее время' },
    threadComposer: { name: 'Композитор Тредов', desc: 'Пишите треды' },
    viralScore: { name: 'Предсказатель вирусности', desc: 'Балл в реальном времени' },
    bioGenerator: { name: 'Генератор Bio', desc: 'Bio для любой платформы' },
    videoIdeas: { name: 'Генератор видео-идей', desc: 'Готовые идеи для съёмки' },
    qrGenerator: { name: 'QR-код генератор', desc: 'Бесплатные QR-коды' }
  },
  de: {
    hookGenerator: { name: 'Hook Generator', desc: 'Virale Hooks erstellen' },
    captionGenerator: { name: 'Caption Generator', desc: 'Captions schreiben' },
    scriptStudio: { name: 'Script Studio', desc: 'Video-Skripte schreiben' },
    viralAnalyzer: { name: 'Viral Analyzer', desc: 'Viral-Potenzial analysieren' },
    stealVideo: { name: 'Video Klauen', desc: 'Virale Inhalte analysieren' },
    linkInBio: { name: 'Link in Bio Builder', desc: 'Kostenlose Bio-Seite' },
    trendRadar: { name: 'Trend Radar', desc: 'Trends entdecken' },
    competitorSpy: { name: 'Konkurrenz Spion', desc: 'Konkurrenz analysieren' },
    hashtagResearch: { name: 'Hashtag Recherche', desc: 'Beste Hashtags finden' },
    contentPlanner: { name: 'Content Planer', desc: '30-Tage Kalender' },
    contentRepurposer: { name: 'Content Umwandler', desc: 'Inhalte umwandeln' },
    abTester: { name: 'A/B Tester', desc: 'Versionen vergleichen' },
    carouselPlanner: { name: 'Carousel Planer', desc: 'Carousel planen' },
    engagementBooster: { name: 'Engagement Booster', desc: 'Engagement steigern' },
    postingOptimizer: { name: 'Posting Optimierer', desc: 'Beste Posting-Zeit' },
    threadComposer: { name: 'Thread Komponist', desc: 'Threads schreiben' },
    viralScore: { name: 'Viral-Score-Prediktor', desc: 'Echtzeit Viral-Score' },
    bioGenerator: { name: 'Bio Generator', desc: 'Plattform-perfekte Bios' },
    videoIdeas: { name: 'Video-Ideen-Generator', desc: 'Drehfertige Ideen' },
    qrGenerator: { name: 'QR-Code Generator', desc: 'Kostenlose QR-Codes' }
  },
  fr: {
    hookGenerator: { name: 'Générateur de Hooks', desc: 'Créer des hooks viraux' },
    captionGenerator: { name: 'Générateur de Légendes', desc: 'Écrire des légendes' },
    scriptStudio: { name: 'Studio de Scripts', desc: 'Écrire des scripts' },
    viralAnalyzer: { name: 'Analyseur Viral', desc: 'Analyser le potentiel' },
    stealVideo: { name: 'Voler Cette Vidéo', desc: 'Analyser le contenu' },
    linkInBio: { name: 'Link in Bio Builder', desc: 'Page bio gratuite' },
    trendRadar: { name: 'Radar des Tendances', desc: 'Découvrir les tendances' },
    competitorSpy: { name: 'Espion Concurrent', desc: 'Analyser la concurrence' },
    hashtagResearch: { name: 'Recherche Hashtags', desc: 'Meilleurs hashtags' },
    contentPlanner: { name: 'Planificateur de Contenu', desc: 'Calendrier 30 jours' },
    contentRepurposer: { name: 'Recycleur de Contenu', desc: 'Recycler le contenu' },
    abTester: { name: 'Test A/B', desc: 'Comparer les versions' },
    carouselPlanner: { name: 'Planificateur Carousel', desc: 'Planifier les carousels' },
    engagementBooster: { name: 'Booster d\'Engagement', desc: 'Augmenter l\'engagement' },
    postingOptimizer: { name: 'Optimiseur de Posts', desc: 'Meilleur moment' },
    threadComposer: { name: 'Compositeur de Threads', desc: 'Écrire des threads' },
    viralScore: { name: 'Prédicteur de viralité', desc: 'Score viral en temps réel' },
    bioGenerator: { name: 'Générateur de Bio', desc: 'Bios parfaites par plateforme' },
    videoIdeas: { name: "Générateur d'idées vidéo", desc: 'Idées prêtes à filmer' },
    qrGenerator: { name: 'Générateur QR Code', desc: 'QR codes gratuits' }
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('free')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showAdModal, setShowAdModal] = useState(false)
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false)
  const [dailyBonusLoading, setDailyBonusLoading] = useState(false)
  const [dailyBonusMessage, setDailyBonusMessage] = useState('')
  const [dailyStreak, setDailyStreak] = useState(0)
  const [adCountdown, setAdCountdown] = useState(30)
  const [adComplete, setAdComplete] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [showStats, setShowStats] = useState(false)
  const [referralData, setReferralData] = useState<{referralCode: string, referralCount: number, totalEarned: number} | null>(null)
  const [showReferral, setShowReferral] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [showBrandKit, setShowBrandKit] = useState(false)
  const [brandProfile, setBrandProfile] = useState<any>(null)
  const [brandSaving, setBrandSaving] = useState(false)
  const [brandForm, setBrandForm] = useState({
    brandName: '', niche: '', targetAudience: '', tone: 'professional',
    contentStyle: 'educational', platforms: ['tiktok', 'instagram'], keywords: '', description: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  
  const t = texts[language] || texts.en
  const toolT = toolNames[language] || toolNames.en

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setSession(session)
        fetchCredits(session.user.id)
        fetchStats(session.user.id)
        checkDailyBonus(session)
        fetchReferral(session.user.id)
        fetchBrandProfile(session.user.id)
        
        // Google OAuth sonrası pending referral kontrolü
        const pendingReferral = localStorage.getItem('pending_referral')
        if (pendingReferral) {
          try {
            await fetch('/api/referral', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                referralCode: pendingReferral,
                newUserId: session.user.id
              })
            })
            localStorage.removeItem('pending_referral')
            // Kredileri yenile
            fetchCredits(session.user.id)
          } catch (err) {
            console.error('Referral error:', err)
          }
        }
      }
    })
  }, [router])

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('credits')
      .select('balance, plan, avatar_url')
      .eq('user_id', userId)
      .single()
    
    if (data) {
      setCredits(data.balance || 0)
      setPlan(data.plan || 'free')
      setAvatarUrl(data.avatar_url)
    }
  }

  const fetchReferral = async (userId: string) => {
    try {
      const s = await supabase.auth.getSession()
      const res = await fetch(`/api/referral?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${s.data.session?.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReferralData(data)
      }
    } catch (err) {
      console.error('Error fetching referral:', err)
    }
  }

  const copyReferralCode = () => {
    if (referralData?.referralCode) {
      const referralLink = `https://mediatoolkit.site/register?ref=${referralData.referralCode}`
      navigator.clipboard.writeText(referralLink)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  const shareOnTwitter = () => {
    const text = `I'm using MediaToolkit to create viral content with AI! 🚀 Use my referral code and get 100 FREE credits: `
    const url = `https://mediatoolkit.site/register?ref=${referralData?.referralCode}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnWhatsApp = () => {
    const text = `Hey! I'm using MediaToolkit to create viral content. Use my code ${referralData?.referralCode} and get 100 FREE credits! 🎁 https://mediatoolkit.site/register?ref=${referralData?.referralCode}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const checkDailyBonus = async (sess: any) => {
    try {
      const res = await fetch('/api/daily-bonus', {
        headers: { 'Authorization': `Bearer ${sess.access_token}` }
      })
      const data = await res.json()
      if (data.claimed) setDailyBonusClaimed(true)
      if (data.streak) setDailyStreak(data.streak)
    } catch {}
  }

  const claimDailyBonus = async () => {
    if (!session || dailyBonusClaimed || dailyBonusLoading) return
    setDailyBonusLoading(true)
    try {
      const res = await fetch('/api/daily-bonus', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setDailyBonusClaimed(true)
        setCredits(data.newBalance)
        setDailyStreak(data.streak || 0)
        setDailyBonusMessage(t.bonusClaimed)
        setTimeout(() => setDailyBonusMessage(''), 3000)
      } else {
        setDailyBonusClaimed(true)
      }
    } catch {}
    setDailyBonusLoading(false)
  }

  const fetchStats = async (userId: string) => {
    try {
      const s = await supabase.auth.getSession()
      const res = await fetch('/api/user-stats', {
        headers: { 'Authorization': `Bearer ${s.data.session?.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchBrandProfile = async (userId: string) => {
    try {
      const s = await supabase.auth.getSession()
      const res = await fetch('/api/brand-profile', {
        headers: { 'Authorization': `Bearer ${s.data.session?.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setBrandProfile(data.profile)
          setBrandForm({
            brandName: data.profile.brand_name || '',
            niche: data.profile.niche || '',
            targetAudience: data.profile.target_audience || '',
            tone: data.profile.tone || 'professional',
            contentStyle: data.profile.content_style || 'educational',
            platforms: data.profile.platforms || ['tiktok', 'instagram'],
            keywords: (data.profile.keywords || []).join(', '),
            description: data.profile.description || ''
          })
        }
      }
    } catch (err) {
      console.error('Error fetching brand profile:', err)
    }
  }

  const saveBrandProfile = async () => {
    if (!user) return
    setBrandSaving(true)
    try {
      const s = await supabase.auth.getSession()
      const res = await fetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s.data.session?.access_token}` },
        body: JSON.stringify({
          brandName: brandForm.brandName,
          niche: brandForm.niche,
          targetAudience: brandForm.targetAudience,
          tone: brandForm.tone,
          contentStyle: brandForm.contentStyle,
          platforms: brandForm.platforms,
          keywords: brandForm.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
          description: brandForm.description
        })
      })
      if (res.ok) {
        const data = await res.json()
        setBrandProfile(data.profile)
        setShowBrandKit(false)
      }
    } catch (err) {
      console.error('Error saving brand profile:', err)
    }
    setBrandSaving(false)
  }

  const togglePlatform = (p: string) => {
    setBrandForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter((x: string) => x !== p)
        : [...prev.platforms, p]
    }))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const startWatchingAd = () => {
    // Open Monetag ad in new tab
    window.open('https://omg10.com/4/10955810', '_blank')
    setShowAdModal(true)
    setAdCountdown(15)
    setAdComplete(false)
  }

  useEffect(() => {
    if (showAdModal && adCountdown > 0 && !adComplete) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showAdModal && adCountdown === 0 && !adComplete) {
      addAdCredits()
    }
  }, [showAdModal, adCountdown, adComplete])

  const addAdCredits = async () => {
    if (!user) return
    setAdComplete(true)
    
    try {
      const s = await supabase.auth.getSession()
      const res = await fetch('/api/watch-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s.data.session?.access_token}` }
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        setCredits(data.newBalance)
      }
    } catch (err) {
      console.error('Ad credit error:', err)
    }
    
    setTimeout(() => {
      setShowAdModal(false)
    }, 2000)
  }

  // Avatar Upload
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
        setUploadMessage({ type: 'success', text: t.uploadSuccess || 'Photo updated!' })
      } else {
        setUploadMessage({ type: 'error', text: data.error || t.uploadError || 'Upload failed' })
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: t.uploadError || 'Upload failed' })
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAvatar = async () => {
    if (!user) return
    setUploading(true)

    const { error } = await supabase
      .from('credits')
      .update({ avatar_url: null })
      .eq('user_id', user.id)

    if (!error) {
      setAvatarUrl(null)
      setUploadMessage({ type: 'success', text: t.photoRemoved || 'Photo removed' })
    }
    setUploading(false)
  }

  const tools = [
    { key: 'linkInBio', icon: '🔗', href: '/tools/link-in-bio', credits: 0, category: 'create' },
    { key: 'hookGenerator', icon: '🎣', href: '/tools/hook-generator', credits: 3, category: 'create' },
    { key: 'captionGenerator', icon: '✍️', href: '/tools/caption-generator', credits: 3, category: 'create' },
    { key: 'stealVideo', icon: '🎯', href: '/tools/steal-video', credits: 8, category: 'analyze' },
    { key: 'viralAnalyzer', icon: '📊', href: '/tools/viral-analyzer', credits: 5, category: 'analyze' },
    { key: 'scriptStudio', icon: '🎬', href: '/tools/script-studio', credits: 6, category: 'create' },
    { key: 'contentPlanner', icon: '📅', href: '/tools/content-planner', credits: 10, category: 'optimize' },
    { key: 'trendRadar', icon: '📡', href: '/tools/trend-radar', credits: 4, category: 'analyze' },
    { key: 'competitorSpy', icon: '🕵️', href: '/tools/competitor-spy', credits: 8, category: 'analyze' },
    { key: 'hashtagResearch', icon: '#️⃣', href: '/tools/hashtag-research', credits: 3, category: 'optimize' },
    { key: 'contentRepurposer', icon: '♻️', href: '/tools/content-repurposer', credits: 8, category: 'create' },
    { key: 'abTester', icon: '⚔️', href: '/tools/ab-tester', credits: 5, category: 'analyze' },
    { key: 'carouselPlanner', icon: '🎠', href: '/tools/carousel-planner', credits: 5, category: 'create' },
    { key: 'engagementBooster', icon: '🚀', href: '/tools/engagement-booster', credits: 4, category: 'optimize' },
    { key: 'postingOptimizer', icon: '⏰', href: '/tools/posting-optimizer', credits: 2, category: 'optimize' },
    { key: 'threadComposer', icon: '🧵', href: '/tools/thread-composer', credits: 5, category: 'create' },
    { key: 'viralScore', icon: '⚡', href: '/tools/viral-score', credits: 3, category: 'analyze' },
    { key: 'bioGenerator', icon: '📝', href: '/tools/bio-generator', credits: 3, category: 'create' },
    { key: 'videoIdeas', icon: '💡', href: '/tools/video-ideas', credits: 5, category: 'create' },
    { key: 'qrGenerator', icon: '📱', href: '/tools/qr-generator', credits: 0, category: 'create' },
  ]

  const [filter, setFilter] = useState('all')
  const filteredTools = filter === 'all' ? tools : tools.filter(tool => tool.category === filter)

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">MediaToolkit</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm"
              >
                {languageNames[language]?.split(' ')[0] || '🌐'}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false) }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition ${language === lang ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300'}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400 font-medium">✦ {credits}</span>
            </div>

            {/* Watch Ad Button */}
            <button
              onClick={startWatchingAd}
              className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition hidden sm:flex items-center gap-1"
            >
              🎬 +{plan === 'pro' ? 50 : 10}
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 cursor-pointer">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="font-semibold text-white">{user.email?.split('@')[0] || 'User'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <button 
                  onClick={() => setShowAvatarModal(true)} 
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
                >
                  {t.changePhoto}
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-800 transition"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PRO Upgrade Banner - only for free users */}
      {plan === 'free' && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <Link href="/pricing" className="block group">
            <div className="relative overflow-hidden p-4 sm:p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <p className="font-semibold text-white">{language === 'tr' ? 'PRO\'ya Yükselt' : language === 'ru' ? 'Перейти на PRO' : language === 'de' ? 'Auf PRO upgraden' : language === 'fr' ? 'Passer à PRO' : 'Upgrade to PRO'}</p>
                    <p className="text-sm text-gray-400">{language === 'tr' ? '1000 kredi/ay, öncelikli destek, gelişmiş özellikler' : language === 'ru' ? '1000 кредитов/мес, приоритетная поддержка' : language === 'de' ? '1000 Credits/Monat, Priority-Support' : language === 'fr' ? '1000 crédits/mois, support prioritaire' : '1000 credits/mo, priority support, advanced features'}</p>
                  </div>
                </div>
                <div className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-sm group-hover:opacity-90 transition whitespace-nowrap">
                  {language === 'tr' ? 'Planları Gör →' : language === 'ru' ? 'Смотреть планы →' : language === 'de' ? 'Pläne ansehen →' : language === 'fr' ? 'Voir les plans →' : 'View Plans →'}
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t.welcome}, {user.email?.split('@')[0] || 'User'}! 👋</h1>
            <p className="text-gray-400">{t.readyToCreate}</p>
          </div>
          <div className="flex gap-2 self-start flex-wrap">
            <Link
              href="/library"
              className="px-4 py-2 border rounded-xl text-sm font-medium transition flex items-center gap-2 bg-white/5 border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
            >
              📚 {language === 'tr' ? 'Kütüphane' : 'Library'}
            </Link>
            <button
              onClick={() => setShowBrandKit(!showBrandKit)}
              className={`px-4 py-2 border rounded-xl text-sm font-medium transition flex items-center gap-2 ${showBrandKit ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : brandProfile?.niche ? 'bg-white/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 animate-pulse'}`}
            >
              🎨 Brand Kit {brandProfile?.niche ? '✓' : ''}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 border rounded-xl text-sm font-medium transition flex items-center gap-2 ${showStats ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              📊 {t.stats}
            </button>
            <button
              onClick={() => setShowReferral(!showReferral)}
              className={`px-4 py-2 border rounded-xl text-sm font-medium transition flex items-center gap-2 ${showReferral ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              🎁 {t.referral}
            </button>
          </div>
        </div>

        {/* Brand Kit Panel */}
        {showBrandKit && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400">🎨 Brand Kit</h3>
                <p className="text-sm text-gray-400">{language === 'tr' ? 'Profilini ayarla, tüm araçlar sana özel üretsin' : 'Set up your profile, all tools will create personalized content'}</p>
              </div>
              {brandProfile?.niche && <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">✓ {language === 'tr' ? 'Aktif' : 'Active'}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Marka Adı' : 'Brand Name'}</label>
                <input type="text" value={brandForm.brandName} onChange={e => setBrandForm({...brandForm, brandName: e.target.value})} placeholder={language === 'tr' ? 'örn: FitnessTR' : 'e.g: FitnessPro'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Niş / Alan *' : 'Niche / Area *'}</label>
                <input type="text" value={brandForm.niche} onChange={e => setBrandForm({...brandForm, niche: e.target.value})} placeholder={language === 'tr' ? 'örn: Fitness, Kişisel Gelişim' : 'e.g: Fitness, Personal Development'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Hedef Kitle' : 'Target Audience'}</label>
                <input type="text" value={brandForm.targetAudience} onChange={e => setBrandForm({...brandForm, targetAudience: e.target.value})} placeholder={language === 'tr' ? 'örn: 18-30 yaş, fitness meraklıları' : 'e.g: 18-30, fitness enthusiasts'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Anahtar Kelimeler' : 'Keywords'}</label>
                <input type="text" value={brandForm.keywords} onChange={e => setBrandForm({...brandForm, keywords: e.target.value})} placeholder={language === 'tr' ? 'örn: spor, beslenme, motivasyon' : 'e.g: sports, nutrition, motivation'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Ton' : 'Tone'}</label>
                <div className="flex flex-wrap gap-2">
                  {[['professional', language === 'tr' ? 'Profesyonel' : 'Professional'], ['casual', language === 'tr' ? 'Samimi' : 'Casual'], ['humorous', language === 'tr' ? 'Esprili' : 'Humorous'], ['inspiring', language === 'tr' ? 'İlham Verici' : 'Inspiring']].map(([val, label]) => (
                    <button key={val} onClick={() => setBrandForm({...brandForm, tone: val})} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${brandForm.tone === val ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'İçerik Stili' : 'Content Style'}</label>
                <div className="flex flex-wrap gap-2">
                  {[['educational', language === 'tr' ? 'Eğitici' : 'Educational'], ['entertaining', language === 'tr' ? 'Eğlenceli' : 'Entertaining'], ['storytelling', language === 'tr' ? 'Hikaye' : 'Storytelling'], ['tutorial', language === 'tr' ? 'Tutorial' : 'Tutorial']].map(([val, label]) => (
                    <button key={val} onClick={() => setBrandForm({...brandForm, contentStyle: val})} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${brandForm.contentStyle === val ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Platformlar' : 'Platforms'}</label>
                <div className="flex flex-wrap gap-2">
                  {[['tiktok', '🎵 TikTok'], ['instagram', '📸 Instagram'], ['youtube', '🎬 YouTube'], ['twitter', '🐦 Twitter/X'], ['linkedin', '💼 LinkedIn']].map(([val, label]) => (
                    <button key={val} onClick={() => togglePlatform(val)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${brandForm.platforms.includes(val) ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1.5">{language === 'tr' ? 'Hakkında (opsiyonel)' : 'About (optional)'}</label>
                <textarea value={brandForm.description} onChange={e => setBrandForm({...brandForm, description: e.target.value})} placeholder={language === 'tr' ? 'Markan hakkında kısa bilgi...' : 'Brief info about your brand...'} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm resize-none" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={saveBrandProfile} disabled={brandSaving || !brandForm.niche.trim()} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                {brandSaving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{language === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</> : <>{language === 'tr' ? '💾 Kaydet' : '💾 Save'}</>}
              </button>
            </div>
          </div>
        )}

        {/* Referral Panel */}
        {showReferral && referralData && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left - Info */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-1">🎁 {t.referral}</h3>
                <p className="text-sm text-gray-400 mb-2">{t.referralDesc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">🎯 1 {language === 'tr' ? 'davet' : 'invite'} = +100 {language === 'tr' ? 'kredi' : 'credits'}</span>
                  <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">🏆 5 {language === 'tr' ? 'davet' : 'invites'} = +250 bonus</span>
                  <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">👑 10 {language === 'tr' ? 'davet' : 'invites'} = +500 bonus</span>
                </div>
                
                {/* Referral Code */}
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-black/30 border border-green-500/30 rounded-xl">
                    <span className="text-xs text-gray-400">{t.yourCode}:</span>
                    <span className="ml-2 text-lg font-mono font-bold text-green-400">{referralData.referralCode}</span>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium hover:bg-green-500/30 transition"
                  >
                    {codeCopied ? '✓ ' + t.codeCopied : '📋 ' + t.copyCode}
                  </button>
                </div>
              </div>

              {/* Right - Stats & Share */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">{referralData.referralCount}</div>
                    <div className="text-xs text-gray-400">{t.friendsInvited}</div>
                  </div>
                  <div className="text-center px-4 py-2 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">+{referralData.totalEarned}</div>
                    <div className="text-xs text-gray-400">{t.creditsEarned}</div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={shareOnTwitter}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2"
                  >
                    𝕏 Twitter
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2"
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const text = `Check out MediaToolkit - AI tools for content creators! Use my code ${referralData?.referralCode} for 100 FREE credits 🎁`
                      const url = `https://mediatoolkit.site/register?ref=${referralData?.referralCode}`
                      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
                    }}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2"
                  >
                    ✈️ Telegram
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://mediatoolkit.site/register?ref=${referralData?.referralCode}`
                      navigator.clipboard.writeText(url)
                    }}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2"
                  >
                    🔗 {language === 'tr' ? 'Linki Kopyala' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Uses */}
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl">
              <div className="text-3xl font-bold text-purple-400">{stats.totalUses}</div>
              <div className="text-sm text-gray-400">{t.totalUses}</div>
              <div className="text-xs text-gray-500 mt-1">{t.thisMonth}</div>
            </div>
            
            {/* Credits Spent */}
            <div className="p-4 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-2xl">
              <div className="text-3xl font-bold text-pink-400">{stats.totalCreditsSpent}</div>
              <div className="text-sm text-gray-400">{t.creditsSpent}</div>
              <div className="text-xs text-gray-500 mt-1">{t.thisMonth}</div>
            </div>

            {/* Weekly Chart */}
            <div className="col-span-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="text-sm text-gray-400 mb-3">{t.weeklyUsage}</div>
              <div className="flex items-end gap-2 h-20">
                {stats.weeklyUsage?.map((day: {day: string, count: number}, i: number) => {
                  const maxCount = Math.max(...stats.weeklyUsage.map((d: any) => d.count), 1)
                  const height = (day.count / maxCount) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                      <span className="text-xs text-gray-500">{day.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            {stats.recentTools?.length > 0 && (
              <div className="col-span-2 lg:col-span-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-sm text-gray-400 mb-3">{t.recentActivity}</div>
                <div className="flex flex-wrap gap-2">
                  {stats.recentTools.slice(0, 5).map((tool: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm">
                      <span className="text-purple-400">{toolT[tool.tool_name.replace(/-/g, '').replace(/([A-Z])/g, (m: string) => m.toLowerCase())]?.name || tool.tool_name}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{tool.credits_used} ✦</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily Bonus Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="font-semibold text-amber-400">{t.dailyBonus}</h3>
                <p className="text-sm text-gray-400">{dailyBonusClaimed ? t.comeBackTomorrow : t.dailyBonusDesc}</p>
                {dailyStreak > 0 && <p className="text-xs text-amber-500/60 mt-0.5">🔥 {dailyStreak} {t.streak}</p>}
              </div>
            </div>
            {dailyBonusMessage ? (
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium">✓ +10</span>
            ) : (
              <button
                onClick={claimDailyBonus}
                disabled={dailyBonusClaimed || dailyBonusLoading}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition ${dailyBonusClaimed ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
              >
                {dailyBonusLoading ? '...' : dailyBonusClaimed ? '✓' : t.claimBonus}
              </button>
            )}
          </div>
        </div>

        {/* Watch Ad Card - Mobile */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl sm:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-400">{t.watchAd}</h3>
              <p className="text-sm text-gray-400">{t.watchAdDesc}</p>
            </div>
            <button
              onClick={startWatchingAd}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium"
            >
              +{plan === 'pro' ? 50 : 10} 🎬
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: t.allTools, icon: '📦' },
            { key: 'create', label: t.create, icon: '✨' },
            { key: 'analyze', label: t.analyze, icon: '🔍' },
            { key: 'optimize', label: t.optimize, icon: '⚡' },
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                filter === f.key 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-lg ${tool.credits === 0 ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {tool.credits === 0 ? (language === 'tr' ? 'ÜCRETSİZ' : 'FREE') : `${tool.credits} ✦`}
                </span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition">
                {toolT[tool.key]?.name || tool.key}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${
                  tool.category === 'create' ? 'bg-green-500' : 
                  tool.category === 'analyze' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></span>
                {tool.category === 'create' ? t.create : tool.category === 'analyze' ? t.analyze : t.optimize}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
            {!adComplete ? (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-bold mb-2">{t.watching}</h3>
                
                {/* Ad Content */}
                <div className="my-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl min-h-[200px] flex items-center justify-center">
                  <div id="monetag-ad-container">
                    <p className="text-sm text-gray-300 mb-2">✨ MediaToolkit Pro ✨</p>
                    <p className="text-xs text-gray-400">Upgrade to Pro for 1000 credits/month!</p>
                    <p className="text-xs text-purple-400 mt-2">$4.99/month → mediatoolkit.site/pricing</p>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-4">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((15 - adCountdown) / 15) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{adCountdown} {t.remaining}</p>
                </div>

                <button
                  onClick={() => setShowAdModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition"
                >
                  {t.cancel}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{t.complete}</h3>
                <p className="text-gray-400">+{plan === 'pro' ? 50 : 10} {t.credits}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.changePhoto}</h2>
              <button onClick={() => setShowAvatarModal(false)} className="text-gray-500 hover:text-white transition">✕</button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex justify-center mb-6">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Upload Message */}
            {uploadMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${uploadMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {uploadMessage.text}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={uploadAvatar}
              className="hidden"
            />

            {/* Upload Button */}
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
              <button onClick={removeAvatar} disabled={uploading} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-500/30 transition disabled:opacity-50">
                {t.removePhoto}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
