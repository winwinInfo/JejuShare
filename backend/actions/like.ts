'use server'

import { createSupabaseServer } from '@/backend/supabase'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/backend/actions/auth'

export async function toggleLike(postId: number): Promise<ActionResult & { liked?: boolean }> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: '로그인이 필요합니다.' }

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)
    if (error) return { ok: false, error: '좋아요 취소에 실패했습니다.' }
    revalidatePath(`/posts/${postId}`)
    return { ok: true, liked: false }
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, post_id: postId })
    if (error) return { ok: false, error: '좋아요에 실패했습니다.' }
    revalidatePath(`/posts/${postId}`)
    return { ok: true, liked: true }
  }
}
