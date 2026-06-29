'use client'

import { useState } from 'react'
import { completeProfile } from '@/backend/actions/auth'

export function ProfileForm({ email }: { email: string }) {
  const [form, setForm] = useState({ displayName: '', phone: '', termsAgreed: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await completeProfile(form)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">이메일</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          닉네임 <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={form.displayName}
          onChange={(e) => setForm(p => ({ ...p, displayName: e.target.value }))}
          required
          placeholder="표시될 이름"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          전화번호 <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
          required
          placeholder="010-0000-0000"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="terms"
          checked={form.termsAgreed}
          onChange={(e) => setForm(p => ({ ...p, termsAgreed: e.target.checked }))}
          className="mt-0.5 shrink-0"
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
          매칭 수락 시 전화번호·이메일·발생처 상세주소가 상대방에게 공개됩니다.{' '}
          <span className="text-foreground font-medium">이용약관에 동의합니다.</span>
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? '저장 중...' : '시작하기'}
      </button>
    </form>
  )
}
