import { createSupabaseServer } from '@/backend/supabase'
import type { Post } from '@/backend/types'

export async function getLikeStatus(postId: number): Promise<boolean> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  return !!data
}

export async function getLikeCount(postId: number): Promise<number> {
  const supabase = await createSupabaseServer()
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  return count ?? 0
}

export async function getLikedPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('likes')
    .select('post_id, posts(id, post_type, title, body, region, image_url, amount, timing, status, created_at, user(id, nickname))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getLikedPosts error:', error.message)
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
