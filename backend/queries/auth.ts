import { cache } from 'react'
import { createSupabaseServer } from '@/backend/supabase'
import { timed } from '@/backend/timed'
import { NextRequest, NextResponse } from 'next/server'

// 페이지 렌더가 의존하는 최소 신원 정보. (id, email만 — 호출부가 쓰는 건 이 둘뿐)
export type ServerUser = {
  id: string
  email: string | null
}

// 페이지 렌더용 신원 조회.
// getClaims()는 쿠키의 JWT 서명/만료를 '로컬'에서 검증한다(비대칭 서명 키 사용 시 네트워크 왕복 0).
// → 페이지 이동마다 Auth 서버로 왕복하던 getUser()를 대체해 렌더 지연을 제거.
// 폐기(revoke) 토큰까지 잡는 네트워크 검증은 실제 쓰기를 하는 서버 액션 + RLS에 남겨둔다.
// request 스코프 안에서는 cache로 1회만 평가.
export const getServerUser = cache(async (): Promise<ServerUser | null> => {
  const supabase = await createSupabaseServer()
  const { data, error } = await timed('getServerUser.getClaims', () =>
    supabase.auth.getClaims(),
  )

  const claims = data?.claims
  if (error || !claims?.sub) return null

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
  }
})

export async function handleAuthCallback(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('exchangeCodeForSession error:', error)
      return NextResponse.redirect(new URL('/login?error=callback', origin))
    }
    
    // 방금 코드 교환으로 세션이 막 수립된 직후라 로컬 검증으로 충분.
    const { data } = await supabase.auth.getClaims()
    const userId = data?.claims?.sub

    if (userId) {
      const { data: profile } = await supabase
        .from('user')
        .select('nickname')
        .eq('id', userId)
        .single()

      if (!profile?.nickname) {
        return NextResponse.redirect(new URL('/register', origin))
      }
    }

    return NextResponse.redirect(new URL('/', origin))
  
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
