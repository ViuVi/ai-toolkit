'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [hasRefFromUrl, setHasRefFromUrl] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setReferralCode(ref.toUpperCase())
      setHasRefFromUrl(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.user) {
      const initialCredits = referralCode ? 200 : 100
      await supabase.from('credits').insert({
        user_id: data.user.id,
        balance: initialCredits,
        total_used: 0,
        plan: 'free'
      })

      if (referralCode) {
        try {
          await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode, newUserId: data.user.id })
          })
        } catch (err) {
          console.error('Referral error:', err)
        }
      }
      setSuccess(true)
    }
  }

  const handleGoogleLogin = async () => {
    if (referralCode) localStorage.setItem('pending_referral', referralCode)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Check your email!</h1>
          <p className="text-gray-400 mb-4">We sent a confirmation link to <span className="text-white font-medium">{email}</span></p>
          {referralCode && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm mb-4">
              🎁 +100 bonus credits applied!
            </div>
          )}
          <Link href="/login" className="inline-flex px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">M</div>
            <span className="text-xl font-bold">MediaToolkit</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create account</h1>
          <p className="text-gray-400 mb-6">Start your journey to viral content</p>

          {/* Referral Code Section - Google butonunun ÜSTÜNDE */}
          {hasRefFromUrl ? (
            // Link ile geldiyse - yeşil badge göster
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm mb-4">
              🎁 Referral code applied: <span className="font-mono font-bold">{referralCode}</span> (+100 bonus credits!)
            </div>
          ) : (
            // Link ile gelmediyse - input göster
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">🎁 Referral Code (optional)</span>
                <span className="text-xs text-green-400">+100 bonus!</span>
              </div>
              <input 
                type="text" 
                value={referralCode} 
                onChange={e => setReferralCode(e.target.value.toUpperCase())} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-500/50 placeholder-gray-600" 
                placeholder="Enter referral code" 
                maxLength={8} 
              />
              <p className="text-xs text-gray-500 mt-1.5">
                💡 If you have a referral code, enter it before clicking Google sign-up
              </p>
            </div>
          )}

          {/* Referral varsa yeşil border ile Google butonu */}
          <button 
            onClick={handleGoogleLogin} 
            className={`w-full py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-3 mb-2 ${
              referralCode 
                ? 'bg-green-500/10 border-2 border-green-500/30 hover:bg-green-500/20' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
            {referralCode && <span className="text-green-400 text-sm">(+100 bonus)</span>}
          </button>

          {/* Referral kod girilmişse onay mesajı */}
          {referralCode && !hasRefFromUrl && (
            <p className="text-xs text-green-400 text-center mb-4">
              ✓ Referral code "{referralCode}" will be applied
            </p>
          )}

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-sm">or continue with email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50" placeholder="••••••••" />
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              Create Account
              {referralCode && <span className="text-sm opacity-80">(+100 bonus)</span>}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative text-center max-w-md">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-bold mb-4">100 Free Credits</h2>
          <p className="text-gray-400 text-lg mb-6">Start creating viral content today</p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-green-400 font-medium">🎁 Have a referral code?</p>
            <p className="text-gray-400 text-sm mt-1">Get <span className="text-white font-bold">+100 extra credits</span> for free!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  )
}
