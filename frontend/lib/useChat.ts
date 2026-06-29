'use client'

import { useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/frontend/lib/supabase-browser'
import type { Database } from '@/backend/database.types'

export type ChatMessage = Database['public']['Tables']['messages']['Row']

interface UseChatResult {
  messages: ChatMessage[]
  send: (body: string) => Promise<{ ok: true } | { ok: false; error: string }>
  sending: boolean
}

/**
 * 1:1 채팅 훅.
 * - initial: 서버에서 미리 읽어온 메시지(시간 오름차순). 재접속/새로고침 시 보존.
 * - 실시간: messages 테이블 INSERT 를 conversation_id 로 필터해 구독, 도착분만 append.
 * - 읽음: 상대가 보낸 안 읽은 메시지를 마운트/도착 시 read_at 으로 표시.
 */
export function useChat(
  conversationId: number,
  currentUserId: string,
  initial: ChatMessage[],
): UseChatResult {
  const supabase = getSupabaseBrowser()
  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [sending, setSending] = useState(false)

  const markRead = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', ids)
        .is('read_at', null)
    },
    [supabase],
  )

  // 실시간 구독
  useEffect(() => {
    const channel = supabase
      .channel(`conv:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as ChatMessage
          setMessages((prev) =>
            prev.some((m) => m.id === row.id) ? prev : [...prev, row],
          )
          // 상대가 보낸 메시지면 즉시 읽음 처리
          if (row.sender_id !== currentUserId) {
            void markRead([row.id])
          }
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase, conversationId, currentUserId, markRead])

  // 마운트(대화 전환) 시 서버에서 받아온 안 읽은(상대발신) 메시지 읽음 처리
  useEffect(() => {
    const unread = initial
      .filter((m) => m.sender_id !== currentUserId && m.read_at === null)
      .map((m) => m.id)
    void markRead(unread)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  const send = useCallback(
    async (body: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      const text = body.trim()
      if (!text) return { ok: false, error: '빈 메시지입니다.' }
      setSending(true)
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: currentUserId, body: text })
        .select()
        .single()
      setSending(false)
      if (error) return { ok: false, error: error.message }
      // 내 메시지는 구독보다 먼저 도착할 수 있으니 낙관적으로 즉시 반영(중복은 id로 방지)
      if (data) {
        const row = data as ChatMessage
        setMessages((prev) =>
          prev.some((m) => m.id === row.id) ? prev : [...prev, row],
        )
      }
      return { ok: true }
    },
    [supabase, conversationId, currentUserId],
  )

  return { messages, send, sending }
}
