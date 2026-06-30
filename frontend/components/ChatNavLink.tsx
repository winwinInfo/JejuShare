'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowser } from '@/frontend/lib/supabase-browser'

/**
 * 헤더의 "대화" 링크 + 안 읽은 메시지 배지.
 * - initialUnread: 서버에서 계산한 초기 개수(SSR).
 * - 실시간: messages INSERT/UPDATE 구독(RLS 가 내 대화로 한정) → 도착/읽음 시 재집계.
 * - 경로 이동 시에도 재집계(대화 열람으로 읽음 처리된 직후 반영).
 */
export function ChatNavLink({
  currentUserId,
  initialUnread,
}: {
  currentUserId: string
  initialUnread: number
}) {
  const supabase = getSupabaseBrowser()
  const [unread, setUnread] = useState(initialUnread)
  const pathname = usePathname()

  const refresh = useCallback(async () => {
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .neq('sender_id', currentUserId)
      .is('read_at', null)
    setUnread(count ?? 0)
  }, [supabase, currentUserId])

  useEffect(() => {
    let cancelled = false
    let channel: ReturnType<typeof supabase.channel> | null = null

    // RLS 가 켜진 messages 구독은 Realtime 소켓에 사용자 JWT 가 필요하다.
    // INITIAL_SESSION(쿠키 복원) 시엔 자동 setAuth 가 안 되므로 직접 호출한다.
    void supabase.realtime.setAuth().then(() => {
      if (cancelled) return
      channel = supabase
        .channel('unread-badge')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          () => void refresh(),
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'messages' },
          () => void refresh(),
        )
        .subscribe()
    })

    return () => {
      cancelled = true
      if (channel) void supabase.removeChannel(channel)
    }
  }, [supabase, refresh])

  // 경로가 바뀌면 재집계(예: 대화방을 열어 읽음 처리된 직후)
  useEffect(() => {
    void refresh()
  }, [pathname, refresh])

  return (
    <Link
      href="/chat"
      className="relative shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      대화
      {unread > 0 && (
        <span className="absolute -right-3.5 -top-2 inline-flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
