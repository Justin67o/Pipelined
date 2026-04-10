// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
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
      label: 'Applications',
      icon: (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 4h12M2 8h12M2 12h8"/>
        </svg>
      )
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <polyline points="2,12 6,7 9,10 14,4"/>
        </svg>
      )
    },
  ]

  return (
    <div className="w-[200px] h-screen border-r border-border flex flex-col py-3 gap-0.5 flex-shrink-0 bg-background">

      {/* Wordmark */}
      <div className="px-4 mb-4">
        <span className="text-[20px] font-bold tracking-[-0.03em]" style={{ color: '#6b63d4' }}>Pipelined</span>
      </div>

      {/* Nav links */}
      {links.map(link => {
        const active = pathname === link.href || pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`mx-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors
              ${active
                ? 'bg-secondary text-primary font-medium'
                : 'text-muted-foreground hover:bg-secondary hover:text-primary'
              }`}
          >
            {link.icon}
            {link.label}
          </Link>
        )
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings at bottom */}
      <Link
        href="/settings"
        className={`mx-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors
          ${pathname === '/settings'
            ? 'bg-secondary text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-primary'
          }`}
      >
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.5"/>
          <path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/>
        </svg>
        Settings
      </Link>

    </div>
  )
}
