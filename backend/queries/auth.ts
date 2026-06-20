import { cache } from 'react'
import { createSupabaseServer } from '@/backend/supabase'
import { NextRequest, NextResponse } from 'next/server'

// request 스코프 안에서 getUser() 네트워크 호출을 1번으로 제한
export const getServerUser = cache(async () => {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  return user
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
    
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('user')
        .select('nickname')
        .eq('id', user.id)
        .single()

      if (!profile?.nickname) {
        return NextResponse.redirect(new URL('/register', origin))
      }
    }

    return NextResponse.redirect(new URL('/', origin))
  
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
