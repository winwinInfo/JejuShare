'use server'

import { createSupabaseServer } from '@/backend/supabase'
import { redirect } from 'next/navigation'


export type ActionResult = { ok: true } | { ok: false; error: string }

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
}

export async function completeProfile(form: ProfileForm): Promise<ActionResult> {

    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: '로그인이 필요합니다.' }

    const { error } = await supabase
    .from('user')
    .update({
        nickname: form.displayName,
        phone: form.phone,
    })
    .eq('id', user.id)

    if (error) {
      console.error('completeProfile error:', error)
      return { ok: false, error: '저장에 실패했습니다.' }
    }

    redirect('/')
}