'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/frontend/lib/supabase-browser'
import { ChatShell, ChatInput } from '@/frontend/components/ChatRoom'

interface NewChatRoomProps {
  otherUserId: string
  otherNickname: string
}

/**
 * 아직 대화방이 없는 상태의 작성 화면.
 * 첫 메시지를 보낼 때 send_first_message RPC 로 대화방+메시지를 생성하고
 * 생성된 /chat/[id] 로 교체 이동한다. (빈 대화방은 만들지 않음)
 */
export function NewChatRoom({ otherUserId, otherNickname }: NewChatRoomProps) {
  const router = useRouter()
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setError(null)
    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase.rpc('send_first_message', {
      other_id: otherUserId,
      body: text,
    })
    if (error || data == null) {
      setSending(false)
      setError(
        error?.message === 'blocked'
          ? '차단 관계에서는 대화할 수 없습니다.'
          : '전송에 실패했습니다.',
      )
      return
    }
    router.replace(`/chat/${data}`)
  }

  return (
    <ChatShell
      otherNickname={otherNickname}
      input={
        <ChatInput
          draft={draft}
          setDraft={setDraft}
          onSubmit={handleSubmit}
          disabled={sending}
          error={error}
        />
      }
    >
      <div className="flex flex-1 items-center justify-center px-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          {otherNickname}님에게 첫 메시지를 보내 대화를 시작해 보세요.
        </p>
      </div>
    </ChatShell>
  )
}
