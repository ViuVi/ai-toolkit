'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">M</div>
            <span className="font-bold">MediaToolkit</span>
          </Link>
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition">← Back</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-gray-300">
          <p className="text-lg text-gray-400">Last updated: January 2025</p>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This includes email address, payment information (via Lemon Squeezy), content you create, and usage data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>We use collected information to provide and improve our services, process transactions, send technical notices, and respond to your inquiries.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest using industry-standard practices.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
            <p>We use trusted services including Supabase (authentication/database), Lemon Squeezy (payments), Vercel (hosting), and Groq (AI processing).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us for assistance with your data.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
