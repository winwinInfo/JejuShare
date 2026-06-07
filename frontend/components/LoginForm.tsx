'use client'

import { useState } from 'react'
import { sendMagicLink } from '@/backend/actions/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await sendMagicLink(email)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span>로
        </p>
        <p className="text-sm text-muted-foreground">
          로그인 링크를 보냈습니다. 이메일을 확인해주세요.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? '전송 중...' : '로그인 링크 받기'}
      </button>
    </form>
  )
}
