import { createSupabaseServer } from '@/backend/supabase'
import { supabasePublic } from '@/backend/supabase'
import type { Post } from '@/backend/types'

function toPost(row: {
  id: number
  post_type: string
  title: string
  body: string
  region: string
  image_url: string | null
  amount: string | null
  timing: string | null
  status: string
  created_at: string
  user: { id: string; nickname: string | null } | null
}): Post {
  return {
    id: row.id,
    postType: row.post_type as Post['postType'],
    title: row.title,
    body: row.body,
    region: row.region,
    imageUrl: row.image_url,
    amount: row.amount,
    timing: row.timing,
    status: row.status as Post['status'],
    createdAt: row.created_at,
    author: {
      id: row.user?.id ?? '',
      nickname: row.user?.nickname ?? '알 수 없음',
    },
  }
}

/** 활성 게시글 전체 목록 (최신순) */
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabasePublic
    .from('posts')
    .select('id, post_type, title, body, region, image_url, amount, timing, status, created_at, user(id, nickname)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPosts error:', error.message)
    return []
  }

  return (data ?? []).map(toPost)
}

/** 게시글 단건 조회 */
export async function getPostById(id: number): Promise<Post | null> {
  const { data, error } = await supabasePublic
    .from('posts')
    .select('id, post_type, title, body, region, image_url, amount, timing, status, created_at, user(id, nickname)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getPostById error:', error.message)
    return null
  }

  return toPost(data)
}

/** 로그인 유저 본인 게시글 목록 */
export async function getMyPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('posts')
    .select('id, post_type, title, body, region, image_url, amount, timing, status, created_at, user(id, nickname)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getMyPosts error:', error.message)
    return []
  }

  return (data ?? []).map(toPost)
}
