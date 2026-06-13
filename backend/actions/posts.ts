'use server'

import { createSupabaseServer } from '@/backend/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/backend/actions/auth'
import type { PostType } from '@/backend/types'

export type PostForm = {
  postType: PostType
  title: string
  body: string
  region: string
  imageUrl: string | null
}

export async function createPost(form: PostForm): Promise<ActionResult> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: '로그인이 필요합니다.' }

  if (!form.title.trim()) return { ok: false, error: '제목을 입력해주세요.' }
  if (!form.body.trim()) return { ok: false, error: '내용을 입력해주세요.' }
  if (!form.region.trim()) return { ok: false, error: '지역을 선택해주세요.' }

  const { error } = await supabase.from('posts').insert({
    author_id: user.id,
    post_type: form.postType,
    title: form.title.trim(),
    body: form.body.trim(),
    region: form.region,
    image_url: form.imageUrl,
    status: 'active',
  })

  if (error) {
    console.error('createPost error:', error)
    return { ok: false, error: '저장에 실패했습니다.' }
  }

  revalidatePath('/')
  redirect('/')
}

export async function deletePost(postId: number): Promise<ActionResult> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    console.error('deletePost error:', error)
    return { ok: false, error: '삭제에 실패했습니다.' }
  }

  revalidatePath('/')
  return { ok: true }
}
