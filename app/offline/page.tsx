'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-gray-400 mb-8">
          It looks like you've lost your internet connection. Don't worry — your saved content is still accessible when you reconnect.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Try Again
        </button>
        <p className="text-gray-500 text-sm mt-6">
          MediaToolkit works best with an internet connection for AI-powered features.
        </p>
      </div>
    </div>
  )
}
