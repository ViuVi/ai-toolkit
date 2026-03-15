'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-8 text-gray-300">
          <p className="text-lg text-gray-400">Last updated: January 2025</p>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By accessing MediaToolkit, you agree to be bound by these terms. If you do not agree, please do not use our service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
            <p>MediaToolkit provides AI-powered tools for content creators including hook generation, script writing, caption creation, trend analysis, and content planning.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">4. Credits and Payments</h2>
            <p>Credits are required to use AI tools. Unused credits do not roll over. Prices may change with notice.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">5. Acceptable Use</h2>
            <p>Do not use MediaToolkit to generate illegal, harmful, or offensive content, violate laws, infringe IP rights, or engage in spam/abuse.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
            <p>Content you create belongs to you. MediaToolkit retains rights to the platform, tools, and underlying technology.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
            <p>MediaToolkit is provided "as is" without warranties. We are not liable for indirect or consequential damages.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
