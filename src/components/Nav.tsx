'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, MessageSquare, User } from 'lucide-react'

const links = [
  { href: '/',            label: '홈',     icon: Home },
  { href: '/chapters',   label: '강의',   icon: BookOpen },
  { href: '/inquiries',  label: '문의',   icon: MessageSquare },
]

export default function Nav() {
  const path = usePathname()

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[52px]"
      style={{ backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', backgroundColor: 'rgba(251,251,253,0.85)', borderBottom: '1px solid rgba(210,210,215,0.5)' }}>
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-apple-blue flex items-center justify-center">
            <span className="text-white text-xs font-bold">ORA</span>
          </div>
          <span className="text-[15px] font-semibold text-apple-text hidden sm:block">SQL Workshop</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  active ? 'bg-apple-blue/10 text-apple-blue' : 'text-apple-secondary hover:text-apple-text hover:bg-apple-gray-bg'
                }`}>
                <Icon size={14} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 프로필 */}
        <Link href="/profile/setup"
          className="w-8 h-8 rounded-full bg-apple-gray-bg flex items-center justify-center hover:bg-apple-border transition-colors">
          <User size={16} className="text-apple-secondary" />
        </Link>
      </div>
    </header>
  )
}
