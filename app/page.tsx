import Link from 'next/link'
import { getPosts } from '@/backend/queries/posts'
import { createSupabaseServer } from '@/backend/supabase'
import { PostsFeed } from '@/frontend/components/PostsFeed'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          제주 곳곳의 미활용 자원을 기록하고, 필요한 사람과 잇습니다.
          있어요·구해요로 자원을 발견해보세요.
        </p>
        <Link
          href={user ? '/posts/new' : '/login'}
          className="shrink-0 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + 기록 남기기
        </Link>
      </div>
      <PostsFeed posts={posts} isLoggedIn={!!user} />
    </main>
  )
}
