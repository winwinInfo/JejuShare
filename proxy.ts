import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 로그인 없이 접근 가능한 공개 경로.
 * 새로운 공개 페이지는 이 배열에만 추가하면 됩니다.
 */
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/auth/callback',
  '/posts',
]

/** 로그인은 됐지만 프로필 완성 여부를 체크하지 않을 경로 */
const SKIP_PROFILE_CHECK = ['/register', '/login', '/auth/callback']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p =>
    p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')
  )
}

function skipProfileCheck(pathname: string): boolean {
  return SKIP_PROFILE_CHECK.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 세션 갱신 + 현재 유저 확인
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 공개 경로 → 그대로 통과
  if (isPublicPath(pathname)) return response

  // 비로그인 → 로그인 페이지로
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 프로필 미완성 체크 (닉네임·전화번호 없으면 /register로)
  if (!skipProfileCheck(pathname)) {
    const { data: profile } = await supabase
      .from('user')
      .select('nickname, phone')
      .eq('id', user.id)
      .single()

    if (!profile?.nickname || !profile?.phone) {
      return NextResponse.redirect(new URL('/register', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
