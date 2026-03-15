'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">M</div>
            <span className="font-bold">MediaToolkit</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition">← Back to Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg">Last updated: January 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address and account credentials</li>
              <li>Payment information (processed securely through Lemon Squeezy)</li>
              <li>Content you create using our tools</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest. We use industry-standard security practices to safeguard your information.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
            <p>We use trusted third-party services including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supabase for authentication and database</li>
              <li>Lemon Squeezy for payment processing</li>
              <li>Vercel for hosting</li>
              <li>Groq for AI processing</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us for assistance.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="text-purple-400">support@mediatoolkit.site</p>
          </section>
        </div>
      </main>
    </div>
  )
}
