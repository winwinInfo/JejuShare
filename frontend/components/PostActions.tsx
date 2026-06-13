'use client'

import { useState } from 'react'
import { toggleLike } from '@/backend/actions/like'
import { sendContactEmail } from '@/backend/actions/email'

interface PostActionsProps {
  postId: number
  initialLiked: boolean
  initialLikeCount: number
  emailSent: boolean
  hasContactEmail: boolean
  isOwner: boolean
  isLoggedIn: boolean
}

export function PostActions({
  postId,
  initialLiked,
  initialLikeCount,
  emailSent,
  hasContactEmail,
  isOwner,
  isLoggedIn,
}: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [likeLoading, setLikeLoading] = useState(false)

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [message, setMessage] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailDone, setEmailDone] = useState(emailSent)

  async function handleLike() {
    if (!isLoggedIn) { window.location.href = '/login'; return }
    if (likeLoading) return
    setLikeLoading(true)
    const prev = liked
    setLiked(!prev)
    setLikeCount((c) => c + (prev ? -1 : 1))
    const result = await toggleLike(postId)
    if (!result.ok) {
      setLiked(prev)
      setLikeCount((c) => c + (prev ? 1 : -1))
    }
    setLikeLoading(false)
  }

  async function handleEmailSend(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setEmailLoading(true)
    setEmailError(null)
    const result = await sendContactEmail(postId, message.trim())
    setEmailLoading(false)
    if (!result.ok) {
      setEmailError(result.error)
    } else {
      setEmailDone(true)
      setShowEmailModal(false)
    }
  }

  if (isOwner) return null

  return (
    <>
      <div className="flex items-center gap-3 pt-4">
        {/* 좋아요 하트 버튼 */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors disabled:opacity-50"
          aria-label={liked ? '좋아요 취소' : '좋아요'}
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="1.8"
            className={liked ? 'text-rose-500' : ''}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* 이메일 보내기 버튼 */}
        {hasContactEmail && (
          <button
            onClick={() => {
              if (!isLoggedIn) { window.location.href = '/login'; return }
              if (!emailDone) setShowEmailModal(true)
            }}
            disabled={emailDone}
            className="flex-1 rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {emailDone ? '이메일 보냄 ✓' : '이메일 보내기'}
          </button>
        )}
      </div>

      {/* 이메일 작성 모달 */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 space-y-4">
            <h2 className="text-base font-semibold">게시글 작성자에게 이메일 보내기</h2>
            <p className="text-xs text-muted-foreground">보낸 후에는 수정할 수 없으며, 게시글당 1회만 가능합니다.</p>
            <form onSubmit={handleEmailSend} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="어떤 자원이 필요하신지, 어떻게 활용하실 예정인지 적어주세요."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
              />
              {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={emailLoading || !message.trim()}
                  className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  {emailLoading ? '전송 중…' : '보내기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
