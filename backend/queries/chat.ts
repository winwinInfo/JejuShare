import { createSupabaseServer } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
import type { Database } from '@/backend/database.types'

export type ChatMessageRow = Database['public']['Tables']['messages']['Row']

export interface ConversationSummary {
  id: number
  other: { id: string; nickname: string }
  lastMessage: string | null
  lastMessageAt: string
  unread: number
}

export interface ConversationDetail {
  id: number
  currentUserId: string
  other: { id: string; nickname: string }
  messages: ChatMessageRow[]
}

function otherId(conv: { user_a: string; user_b: string }, me: string) {
  return conv.user_a === me ? conv.user_b : conv.user_a
}

/** 내 대화 목록 (마지막 메시지 최신순). 비로그인 시 빈 배열. */
export async function getConversations(): Promise<ConversationSummary[]> {
  const user = await getServerUser()
  if (!user) return []
  const supabase = await createSupabaseServer()

  const { data: convs } = await supabase
    .from('conversations')
    .select('id, user_a, user_b, last_message_at')
    .order('last_message_at', { ascending: false })

  if (!convs || convs.length === 0) return []

  const otherIds = [...new Set(convs.map((c) => otherId(c, user.id)))]
  const convIds = convs.map((c) => c.id)

  const [{ data: profiles }, { data: msgs }] = await Promise.all([
    supabase.from('user').select('id, nickname').in('id', otherIds),
    supabase
      .from('messages')
      .select('id, conversation_id, sender_id, body, read_at, created_at')
      .in('conversation_id', convIds)
      .order('created_at', { ascending: false }),
  ])

  const nickById = new Map((profiles ?? []).map((p) => [p.id, p.nickname ?? '익명']))
  const lastByConv = new Map<number, string>()
  const unreadByConv = new Map<number, number>()
  for (const m of msgs ?? []) {
    if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m.body)
    if (m.sender_id !== user.id && m.read_at === null) {
      unreadByConv.set(m.conversation_id, (unreadByConv.get(m.conversation_id) ?? 0) + 1)
    }
  }

  return convs.map((c) => {
    const oid = otherId(c, user.id)
    return {
      id: c.id,
      other: { id: oid, nickname: nickById.get(oid) ?? '익명' },
      lastMessage: lastByConv.get(c.id) ?? null,
      lastMessageAt: c.last_message_at,
      unread: unreadByConv.get(c.id) ?? 0,
    }
  })
}

/** 내가 받은(상대 발신) 안 읽은 메시지 총개수. 헤더 배지용. RLS 가 내 대화로 한정. */
export async function getUnreadMessageCount(): Promise<number> {
  const user = await getServerUser()
  if (!user) return 0
  const supabase = await createSupabaseServer()
  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .neq('sender_id', user.id)
    .is('read_at', null)
  return count ?? 0
}

export type NewChatTarget =
  | { kind: 'self' }
  | { kind: 'blocked' }
  | { kind: 'not_found' }
  | { kind: 'existing'; conversationId: number }
  | { kind: 'ok'; otherId: string; otherNickname: string }

/**
 * "대화하기" 진입 시 대상 검증.
 * 이미 대화방이 있으면 그쪽으로 보내고(existing), 없으면 작성 화면용 정보(ok)를 준다.
 * 빈 대화방은 만들지 않는다(생성은 첫 메시지 전송 시점).
 */
export async function resolveNewChatTarget(otherId: string): Promise<NewChatTarget> {
  const user = await getServerUser()
  if (!user) return { kind: 'not_found' }
  if (otherId === user.id) return { kind: 'self' }
  const supabase = await createSupabaseServer()

  const { data: profile } = await supabase
    .from('user')
    .select('id, nickname')
    .eq('id', otherId)
    .maybeSingle()
  if (!profile) return { kind: 'not_found' }

  // 차단 관계면 불가
  const { data: block } = await supabase
    .from('blocks')
    .select('id')
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${user.id})`,
    )
    .maybeSingle()
  if (block) return { kind: 'blocked' }

  // 기존 대화방이 있으면 그쪽으로
  const [a, b] = user.id < otherId ? [user.id, otherId] : [otherId, user.id]
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_a', a)
    .eq('user_b', b)
    .maybeSingle()
  if (conv) return { kind: 'existing', conversationId: conv.id }

  return { kind: 'ok', otherId, otherNickname: profile.nickname ?? '익명' }
}

/** 단일 대화 상세 (당사자만). 권한 없거나 없으면 null. */
export async function getConversationDetail(
  conversationId: number,
): Promise<ConversationDetail | null> {
  const user = await getServerUser()
  if (!user) return null
  const supabase = await createSupabaseServer()

  const { data: conv } = await supabase
    .from('conversations')
    .select('id, user_a, user_b')
    .eq('id', conversationId)
    .maybeSingle()

  // RLS 가 비당사자에겐 행을 숨기므로 null 이면 권한 없음/존재하지 않음.
  if (!conv) return null

  const oid = otherId(conv, user.id)
  const [{ data: profile }, { data: messages }] = await Promise.all([
    supabase.from('user').select('id, nickname').eq('id', oid).maybeSingle(),
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }),
  ])

  return {
    id: conv.id,
    currentUserId: user.id,
    other: { id: oid, nickname: profile?.nickname ?? '익명' },
    messages: messages ?? [],
  }
}
