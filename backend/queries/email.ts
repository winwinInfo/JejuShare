import { createSupabaseServer } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
import type { Post } from '@/backend/types'

export async function getEmailedPosts(): Promise<Post[]> {
  const user = await getServerUser()
  if (!user) return []

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('email_contacts')
    .select('post_id, posts(id, post_type, title, body, region, image_url, amount, timing, status, created_at, user(id, nickname))')
    .eq('sender_id', user.id)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('getEmailedPosts error:', error.message)
    return []
  }

  return (data ?? [])
    .map((row) => {
      const p = Array.isArray(row.posts) ? row.posts[0] : row.posts
      if (!p) return null
      const author = Array.isArray(p.user) ? p.user[0] : p.user
      return {
        id: p.id,
        postType: p.post_type as Post['postType'],
        title: p.title,
        body: p.body,
        region: p.region,
        imageUrl: p.image_url,
        amount: p.amount,
        timing: p.timing,
        status: p.status as Post['status'],
        createdAt: p.created_at,
        author: { id: author?.id ?? '', nickname: author?.nickname ?? '알 수 없음' },
      } satisfies Post
    })
    .filter((p): p is Post => p !== null)
}

export async function getEmailSentStatus(postId: number): Promise<boolean> {
  const user = await getServerUser()
  if (!user) return false

  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('email_contacts')
    .select('id')
    .eq('sender_id', user.id)
    .eq('post_id', postId)
    .single()

  return !!data
}
