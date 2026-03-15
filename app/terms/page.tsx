'use client'
import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg">Last updated: January 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using MediaToolkit, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
            <p>MediaToolkit provides AI-powered tools for content creators, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hook and script generation</li>
              <li>Caption and hashtag suggestions</li>
              <li>Content planning and optimization</li>
              <li>Trend analysis and competitor research</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Credits and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credits are required to use our AI tools</li>
              <li>Unused credits do not roll over to the next billing period</li>
              <li>Refunds are handled according to our refund policy</li>
              <li>Prices are subject to change with notice</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Acceptable Use</h2>
            <p>You agree not to use MediaToolkit to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate illegal, harmful, or offensive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Spam or engage in abusive behavior</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
            <p>Content you create using our tools belongs to you. However, MediaToolkit retains all rights to the underlying technology, tools, and platform.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
            <p>MediaToolkit is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">8. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="text-purple-400">support@mediatoolkit.site</p>
          </section>
        </div>
      </main>
    </div>
  )
}
