'use client'

import Image from 'next/image'
import { signInWithKakao } from '@/backend/actions/auth'

export function LoginForm() {
  return (
    <form action={signInWithKakao}>
      <button type="submit" className="w-full hover:opacity-90 transition-opacity">
        <Image
          src="/kakao_login_medium_narrow.png"
          alt="카카오 로그인"
          width={300}
          height={45}
          className="w-full h-auto"
        />
      </button>
    </form>
  )
}
