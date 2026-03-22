'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/tools/hook-generator', icon: '🎣', label: 'Hooks' },
  { href: '/tools/caption-generator', icon: '✍️', label: 'Captions' },
  { href: '/tools/trend-radar', icon: '📡', label: 'Trends' },
  { href: '/blog', icon: '📝', label: 'Blog' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Don't show on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 md:hidden bottom-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition touch-target ${
                isActive 
                  ? 'text-purple-400' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-purple-400 rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
