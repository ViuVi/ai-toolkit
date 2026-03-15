'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const tools = [
  { icon: '🔍', name: 'Viral Video Finder', desc: 'Discover trending content in your niche' },
  { icon: '🎣', name: 'Hook Generator Pro', desc: 'Create scroll-stopping hooks' },
  { icon: '🎬', name: 'Script Studio', desc: 'Write viral video scripts' },
  { icon: '✍️', name: 'Caption Generator', desc: 'Craft engaging captions' },
  { icon: '🎯', name: 'Steal This Video', desc: 'Reverse engineer viral content' },
  { icon: '📅', name: 'Content Calendar', desc: '30-day content planning' },
  { icon: '📡', name: 'Trend Radar', desc: 'Catch trends before they peak' },
  { icon: '🚀', name: 'Engagement Booster', desc: 'Maximize your engagement' },
]

const stats = [
  { value: '16+', label: 'AI Tools' },
  { value: '50K+', label: 'Content Created' },
  { value: '5', label: 'Languages' },
  { value: '24/7', label: 'AI Powered' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'TikTok Creator', text: 'MediaToolkit helped me go from 1K to 100K followers in 3 months!', avatar: '👩‍🦰' },
  { name: 'Alex K.', role: 'Social Media Manager', text: 'I save 10+ hours every week. The content calendar is a game-changer.', avatar: '👨‍💼' },
  { name: 'Maria L.', role: 'Instagram Influencer', text: 'The hook generator is insane. My reels finally get the views they deserve.', avatar: '👩‍🎤' },
]

const pricingPlans = [
  { name: 'Starter', price: '0', period: '', credits: '50', features: ['5 Tools Access', '50 Credits/month', 'Basic Support'], cta: 'Start Free', popular: false },
  { name: 'Pro', price: '19', period: '/mo', credits: '500', features: ['All 16 Tools', '500 Credits/month', 'Priority Support', 'No Watermarks'], cta: 'Go Pro', popular: true },
  { name: 'Agency', price: '49', period: '/mo', credits: 'Unlimited', features: ['Unlimited Credits', 'Team Access (5 seats)', 'API Access', 'Dedicated Support'], cta: 'Contact Us', popular: false },
]

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">M</div>
            <span className="text-xl font-bold">MediaToolkit</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-gray-400 hover:text-white transition">Tools</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition">Reviews</a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <Link href="/login" className="text-gray-400 hover:text-white transition">Log in</Link>
            <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Trusted by 10,000+ content creators
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Create <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Viral Content</span>
            <br />10x Faster with AI
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The ultimate AI toolkit for content creators. Generate hooks, scripts, captions, and discover viral trends — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2">
              Start Creating Free <span>→</span>
            </Link>
            <a href="#tools" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition">
              Explore Tools
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful AI Tools</h2>
            <p className="text-xl text-gray-400">Everything you need to create viral content</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">{tool.name}</h3>
                <p className="text-gray-500 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
              View all 16 tools <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">From idea to viral content in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Discover Trends', desc: 'Find viral content in your niche with AI-powered trend analysis' },
              { step: '02', title: 'Generate Content', desc: 'Create hooks, scripts, and captions optimized for engagement' },
              { step: '03', title: 'Go Viral', desc: 'Post at the perfect time and watch your content explode' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-xl text-gray-400">See what our users are saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-400">"{t.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[1,2,3,4,5].map(n => <span key={n} className="text-yellow-400">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-400">Start free, upgrade when you need</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative p-6 rounded-2xl border ${plan.popular ? 'bg-gradient-to-b from-purple-500/10 to-pink-500/10 border-purple-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <div className="text-sm text-gray-400 mb-6">{plan.credits} credits</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`block w-full py-3 rounded-full text-center font-semibold transition ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-white/5 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Go Viral?</h2>
            <p className="text-xl text-gray-400 mb-8">Join 10,000+ creators who are growing faster with MediaToolkit</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition">
              Start Creating Free <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">M</div>
              <span className="font-semibold">MediaToolkit</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <div className="text-sm text-gray-500">© 2024 MediaToolkit. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
