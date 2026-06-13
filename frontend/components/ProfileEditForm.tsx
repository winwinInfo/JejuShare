'use client'

import { useState } from 'react'
import { updateProfile } from '@/backend/actions/auth'

type Props = {
  initial: {
    nickname: string | null
    phone: string | null
    bio: string | null
  }
}

export function ProfileEditForm({ initial }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    displayName: initial.nickname ?? '',
    phone: initial.phone ?? '',
    bio: initial.bio ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await updateProfile(form)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
    } else {
      setEditing(false)
    }
  }

  if (!editing) {
    return (
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">프로필</h2>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            수정
          </button>
        </div>
        <dl className="space-y-3">
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-sm text-muted-foreground">닉네임</dt>
            <dd className="text-sm">{initial.nickname ?? '—'}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-sm text-muted-foreground">연락처</dt>
            <dd className="text-sm">{initial.phone ?? '—'}</dd>
          </div>
          {initial.bio && (
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-sm text-muted-foreground">한 줄 소개</dt>
              <dd className="text-sm">{initial.bio}</dd>
            </div>
          )}
        </dl>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">프로필 수정</h2>

      <div>
        <label className="block text-sm font-medium mb-1.5">닉네임 <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={form.displayName}
          onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
          required
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">연락처 <span className="text-red-500">*</span></label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          required
          placeholder="010-0000-0000"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">한 줄 소개</label>
        <input
          type="text"
          value={form.bio}
          onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          placeholder="간단한 소개를 입력하세요"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-foreground text-background py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false)
            setForm({ displayName: initial.nickname ?? '', phone: initial.phone ?? '', bio: initial.bio ?? '' })
            setError(null)
          }}
          className="flex-1 border border-border py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
