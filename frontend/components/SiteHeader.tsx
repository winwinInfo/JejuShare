import Link from 'next/link'
import { createSupabaseServer } from '@/backend/supabase'
import { NavTabs } from '@/frontend/components/NavTabs'

export async function SiteHeader() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  let displayName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('user')
      .select('nickname')
      .eq('id', user.id)
      .single()
    displayName = profile?.nickname ?? null
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 pt-6 pb-4">
        <Link href="/" className="group">
          <h1
            className="text-2xl sm:text-3xl font-semibold tracking-tight leading-none transition-colors group-hover:text-foreground/80"
            style={{ fontFamily: '"EutmanGungseo", serif' }}
          >
            제주 새활용 도감
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            제주의 버려지는 자원을 함께 발견하고, 기록하고,{' '}
            <br className="sm:hidden" />
            다시 쓰는 사람들
          </p>
        </Link>
        <nav className="shrink-0 flex items-center gap-5">
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="text-sm font-medium text-foreground bg-foreground/8 hover:bg-foreground/12 px-3 py-1.5 rounded-lg transition-colors"
              >
                글 올리기
              </Link>
              <Link href="/my" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {displayName ?? '마이페이지'}
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              로그인
            </Link>
          )}
        </nav>
      </div>
      <NavTabs />
    </header>
  )
}
