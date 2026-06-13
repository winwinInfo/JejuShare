'use server'

import { createSupabaseServer } from '@/backend/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


export type ActionResult = { ok: true } | { ok: false; error: string }

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signInWithKakao(): Promise<void> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      scopes: 'account_email profile_nickname',
    },
  })

  if (error || !data.url) {
    redirect('/login?error=kakao')
  }

  redirect(data.url)
}

export async function sendMagicLink(email: string): Promise<ActionResult> {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('sendMagicLink error:', error)
      return { ok: false, error: '이메일 전송에 실패했습니다.' }
    }
    return { ok: true }
}


export type ProfileForm = {
    displayName: string
    phone: string
    termsAgreed: boolean
}

export async function completeProfile(form: ProfileForm): Promise<ActionResult> {
    if (!form.termsAgreed) {
      return { ok: false, error: '이용약관에 동의해야 합니다.' }
    }

    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: '로그인이 필요합니다.' }

    const { error } = await supabase
    .from('user')
    .update({
        nickname: form.displayName,
        phone: form.phone,
        terms_agreed_at: new Date().toISOString(),
    })
    .eq('id', user.id)

    if (error) {
      console.error('completeProfile error:', error)
      return { ok: false, error: '저장에 실패했습니다.' }
    }

    redirect('/')
}

export type ProfileUpdateForm = {
  displayName: string
  phone: string
  bio: string
}

export async function updateProfile(form: ProfileUpdateForm): Promise<ActionResult> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('user')
    .update({
      nickname: form.displayName,
      phone: form.phone,
      bio: form.bio || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('updateProfile error:', error)
    return { ok: false, error: '저장에 실패했습니다.' }
  }

  revalidatePath('/my')
  return { ok: true }
}