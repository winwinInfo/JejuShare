import Link from 'next/link'
import { getServerUser } from '@/backend/queries/auth'
import { getHeaderState } from '@/backend/queries/chat'
import { timed } from '@/backend/timed'
import { ChatNavLink } from '@/frontend/components/ChatNavLink'

export async function SiteHeader() {
  // performance.now() 는 렌더 본문에서 직접 부르면 react-hooks/purity 위반.
  // total 계측은 timed()(컴포넌트 밖 모듈)로 감싸 우회한다.
  return timed('siteHeader.total', () => renderSiteHeader())
}

async function renderSiteHeader() {
  // user.id 는 로컬(JWT) 검증으로 얻고, 닉네임+안읽음은 RPC 1왕복으로 합쳐 가져온다.
  const user = await timed('siteHeader.getServerUser', () => getServerUser())

  let displayName: string | null = null
  let unread = 0
  if (user) {
    const header = await timed('siteHeader.headerState', () => getHeaderState())
    displayName = header?.nickname ?? null
    unread = header?.unread ?? 0
  }

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
