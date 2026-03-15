'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General')
  const [message, setMessage] = useState('')
  const router = useRouter()

  // ⚠️ BU EMAIL ADRESİNİ KENDİ EMAİLİNLE DEĞİŞTİR
  const YOUR_EMAIL = 'your-email@gmail.com'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoSubject = encodeURIComponent(`[MediaToolkit - ${subject}] Message from ${name}`)
    const mailtoBody = encodeURIComponent(`From: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`)
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`
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
              <option value="General">General Inquiry</option>
              <option value="Support">Technical Support</option>
              <option value="Billing">Billing Question</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition resize-none" placeholder="How can we help you?" />
          </div>
          
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">Send Message 📧</button>
          <p className="text-center text-gray-500 text-sm">This will open your email app</p>
        </form>
      </main>
    </div>
  )
}
