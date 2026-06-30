'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useChat, type ChatMessage } from '@/frontend/lib/useChat'

interface ChatRoomProps {
  conversationId: number
  currentUserId: string
  otherNickname: string
  initialMessages: ChatMessage[]
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** 채팅 화면 공통 셸 (흰 배경 카드, 헤더 + 본문 + 입력). */
export function ChatShell({
  otherNickname,
  children,
  input,
}: {
  otherNickname: string
  children: React.ReactNode
  input: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <div className="flex h-[calc(100dvh-13rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Link href="/chat" className="font-mono text-xs text-muted-foreground hover:text-foreground">
            ←
          </Link>
          <span className="text-sm font-medium">{otherNickname}</span>
        </div>
        {children}
        {input}
      </div>
    </div>
  )
}

export function ChatRoom({
  conversationId,
  currentUserId,
  otherNickname,
  initialMessages,
}: ChatRoomProps) {
  const { messages, send, sending } = useChat(conversationId, currentUserId, initialMessages)
  const [draft, setDraft] = useState('')

  // 내가 보낸 마지막 메시지에만 읽음 상태를 표시(카카오톡 방식)
  const lastMineId = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender_id === currentUserId) return messages[i].id
    }
    return null
  })()
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 새 메시지 도착 시 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setError(null)
    setDraft('')
    const result = await send(text)
    if (!result.ok) {
      setDraft(text)
      setError(result.error === 'blocked' ? '차단된 사용자와는 대화할 수 없습니다.' : '전송에 실패했습니다.')
    }
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
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            첫 메시지를 보내 대화를 시작해 보세요.
          </p>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_id === currentUserId
          const day = dayLabel(m.created_at)
          const showDay = i === 0 || dayLabel(messages[i - 1].created_at) !== day
          return (
            <div key={m.id}>
              {showDay && (
                <div className="my-3 text-center text-xs text-muted-foreground">{day}</div>
              )}
              <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-1.5 ${mine ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`max-w-[75vw] rounded-2xl px-3.5 py-2 text-sm sm:max-w-md ${
                      mine ? 'bg-foreground text-background' : 'bg-foreground/[0.06] text-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                  <div className={`flex flex-col text-[10px] text-muted-foreground ${mine ? 'items-end' : 'items-start'}`}>
                    {mine && m.id === lastMineId && (
                      <span className={m.read_at ? 'text-muted-foreground' : 'text-foreground/40'}>
                        {m.read_at ? '' : '1'}
                      </span>
                    )}
                    <span>{timeLabel(m.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ChatShell>
  )
}

/** 입력 영역 (ChatRoom / NewChatRoom 공통). */
export function ChatInput({
  draft,
  setDraft,
  onSubmit,
  disabled,
  error,
}: {
  draft: string
  setDraft: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  disabled: boolean
  error: string | null
}) {
  return (
    <form onSubmit={onSubmit} className="border-t border-border px-4 py-3">
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      <div className="flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit(e)
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="메시지를 입력하세요"
          className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        <button
          type="submit"
          disabled={disabled || !draft.trim()}
          className="shrink-0 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          보내기
        </button>
      </div>
    </form>
  )
}
