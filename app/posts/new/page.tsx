import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerUser } from '@/backend/queries/auth'
import { PostForm } from '@/frontend/components/PostForm'

export default async function PostNewPage() {
  const user = await getServerUser()
  if (!user) redirect('/login')

  // user.email은 getServerUser가 이미 들고 옴(카카오에서 수집).
  // 별도 user 테이블 조회는 같은 값을 위한 중복 왕복이라 제거.
  const defaultEmail = user.email ?? ''

  return (
    <main className="mx-auto max-w-lg px-5 py-8">
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        ← 도감으로
      </Link>

      <h1 className="mt-6 text-xl font-semibold tracking-tight">새 게시글</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        제주의 미활용 자원을 기록해주세요.
      </p>

      <PostForm userId={user.id} defaultEmail={defaultEmail} />
    </main>
  )
}
