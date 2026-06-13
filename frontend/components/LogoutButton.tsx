'use client'

import { signOut } from '@/backend/actions/auth'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        로그아웃
      </button>
    </form>
  )
}
