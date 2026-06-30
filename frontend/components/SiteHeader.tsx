import Link from 'next/link'
import { createSupabaseServer } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
import { getUnreadMessageCount } from '@/backend/queries/chat'
import { timed } from '@/backend/timed'
import { ChatNavLink } from '@/frontend/components/ChatNavLink'

export async function SiteHeader() {
  const headerStart = performance.now()
  const user = await timed('siteHeader.getServerUser', () => getServerUser())

  let displayName: string | null = null
  let unread = 0
  if (user) {
    const supabase = await createSupabaseServer()
    const [{ data: profile }, unreadCount] = await timed(
      'siteHeader.profile+unread',
      () =>
        Promise.all([
          supabase.from('user').select('nickname').eq('id', user.id).single(),
          getUnreadMessageCount(),
        ]),
    )
    displayName = profile?.nickname ?? null
    unread = unreadCount
  }
  console.log(
    `[timing] siteHeader.total: ${(performance.now() - headerStart).toFixed(0)}ms`,
  )

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group shrink-0">
            <h1
              className="text-xl sm:text-3xl font-semibold tracking-tight leading-none whitespace-nowrap transition-colors group-hover:text-foreground/80"
              style={{ fontFamily: '"EutmanGungseo", serif' }}
            >
              제주 새활용 도감
            </h1>
          </Link>
          <nav className="flex min-w-0 items-center justify-end gap-3 sm:gap-5">
            {user ? (
              <>
                <Link
                  href="/posts/new"
                  className="shrink-0 text-sm font-medium text-foreground bg-foreground/8 hover:bg-foreground/12 px-3 py-1.5 rounded-lg transition-colors"
                >
                  글 올리기
                </Link>
                <ChatNavLink currentUserId={user.id} initialUnread={unread} />
                <Link href="/my" className="max-w-[34vw] truncate text-sm text-muted-foreground hover:text-foreground transition-colors sm:max-w-none">
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
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          제주의 버려지는 자원을 함께 발견하고, 기록하고,{' '}
          <br className="sm:hidden" />
          다시 쓰는 사람들
        </p>
      </div>
    </header>
  )
}
