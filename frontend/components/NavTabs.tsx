'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: '도감', href: '/' },
  { label: '새활용 이력', href: '/history' },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-6xl px-5">
      <nav className="flex">
        {tabs.map(({ label, href }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                'inline-block py-2.5 pr-6 text-sm border-b-2 transition-colors',
                isActive
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
