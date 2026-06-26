import { createSupabaseServer } from '@/backend/supabase'
import { supabasePublic } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
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

/** 상세 페이지가 한 화면에 필요로 하는 모든 데이터 */
export type PostDetail = {
  post: Post
  likeCount: number
  liked: boolean
  emailSent: boolean
  hasContactEmail: boolean
}

/**
 * 게시글 상세 페이지용 단일 조회.
 * posts 한 row에 author(user), likes, email_contacts, contact_email을 임베드해
 * Supabase 왕복 1회로 본문·좋아요·이메일 발송 여부를 모두 가져온다.
 * (viewer 본인 email은 JWT(getClaims)에 있으므로 여기서 조회하지 않음)
 *
 * likes/email_contacts/contact_email은 인증 클라이언트의 RLS를 그대로 따른다.
 * likeCount는 기존 getLikeCount(동일 인증 클라이언트의 count)와 같은 가시성으로 집계된다.
 */
export async function getPostDetail(
  id: number,
  viewerId: string | null,
): Promise<PostDetail | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, post_type, title, body, region, image_url, amount, timing, status, created_at, contact_email, user(id, nickname), likes(user_id), email_contacts(sender_id)',
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    if (error) console.error('getPostDetail error:', error.message)
    return null
  }

  const likes = data.likes ?? []
  const emailContacts = data.email_contacts ?? []

  return {
    post: toPost(data),
    likeCount: likes.length,
    liked: viewerId ? likes.some((l) => l.user_id === viewerId) : false,
    emailSent: viewerId ? emailContacts.some((e) => e.sender_id === viewerId) : false,
    hasContactEmail: !!data.contact_email,
  }
}

/** 로그인 유저 본인 게시글 목록 */
export async function getMyPosts(): Promise<Post[]> {
  const user = await getServerUser()
  if (!user) return []

  const supabase = await createSupabaseServer()
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
