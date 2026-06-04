import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 py-5">
        <Link href="/" className="group">
          <h1 className="text-xl font-semibold tracking-tight">
            제주 새활용 도감
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들
          </p>
        </Link>
        <nav className="hidden shrink-0 sm:block">
          <span className="font-mono text-xs text-muted-foreground">
            Jeju Upcycle Dogam
          </span>
        </nav>
      </div>
    </header>
  )
}
