// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    {
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="2" width="5" height="5" rx="1"/>
          <rect x="9" y="2" width="5" height="5" rx="1"/>
          <rect x="2" y="9" width="5" height="5" rx="1"/>
          <rect x="9" y="9" width="5" height="5" rx="1"/>
        </svg>
      )
    },
    {
      href: '/applications',
      icon: (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 4h12M2 8h12M2 12h8"/>
        </svg>
      )
    },
    {
      href: '/analytics',
      icon: (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <polyline points="2,12 6,7 9,10 14,4"/>
        </svg>
      )
    },
  ]

  return (
    <div className="w-[52px] h-screen border-r border-border flex flex-col items-center py-4 gap-1.5 flex-shrink-0 bg-background">
      
      {/* Logo */}
      <div className="w-[26px] h-[26px] bg-[#534AB7] rounded-md flex items-center justify-center mb-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <polyline points="2,10 6,2 10,10"/>
          <line x1="3.5" y1="7" x2="8.5" y2="7"/>
        </svg>
      </div>

      {/* Nav links */}
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
            ${pathname === link.href || pathname.startsWith(link.href)
              ? 'bg-secondary text-primary'
              : 'text-muted-foreground hover:bg-secondary'
            }`}
        >
          {link.icon}
        </Link>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings at bottom */}
      <Link
        href="/settings"
        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
          ${pathname === '/settings'
            ? 'bg-secondary text-primary'
            : 'text-muted-foreground hover:bg-secondary'
          }`}
      >
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.5"/>
          <path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/>
        </svg>
      </Link>

    </div>
  )
}