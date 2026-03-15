'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setError('Failed to send message. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

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

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-400 mb-8">Have a question or feedback? We'd love to hear from you.</p>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold mb-2">Message Sent!</h2>
            <p className="text-gray-400 mb-6">Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">Send Another</button>
              <Link href="/" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">Back to Home</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Question">Billing Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition resize-none" placeholder="How can we help you?" />
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                <>Send Message 📧</>
              )}
            </button>
          </form>
        )}

        <div className="mt-12 pt-12 border-t border-white/5">
          <h2 className="text-xl font-semibold mb-6">Response Time</h2>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4">
            <div className="text-3xl">⏰</div>
            <div>
              <h3 className="font-semibold">24-48 Hours</h3>
              <p className="text-gray-400 text-sm">We typically respond within 1-2 business days</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
