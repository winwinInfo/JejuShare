'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/backend/actions/posts'

export function PostOwnerActions({ postId }: { postId: number }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 확인 모달: ESC로 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!confirming) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) setConfirming(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [confirming, loading])

  async function handleDelete() {
    setLoading(true)
    setError(null)
    const result = await deletePost(postId)
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center gap-3 pt-4">
        <Link
          href={`/posts/${postId}/edit`}
          className="flex-1 rounded-xl border border-border py-3 text-center text-sm font-medium hover:border-foreground/30 transition-colors"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex-1 rounded-xl border border-destructive/40 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
        >
          삭제
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          onClick={() => !loading && setConfirming(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4"
          >
            <h2 id="delete-modal-title" className="text-base font-semibold">게시글을 삭제할까요?</h2>
            <p className="text-xs text-muted-foreground">삭제하면 되돌릴 수 없습니다.</p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
