'use client'

import Image from 'next/image'
import { signInWithKakao } from '@/backend/actions/auth'

export function LoginForm() {
  return (
    <form action={signInWithKakao}>
      <button type="submit" className="hover:opacity-90 transition-opacity">
        <Image
          src="/kakao_login_medium_narrow.png"
          alt="카카오 로그인"
          width={150}
          height={45}
          className="h-auto"
        />
      </button>
    </form>
  )
}
