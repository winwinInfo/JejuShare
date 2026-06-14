import { getPosts } from '@/backend/queries/posts'
import { createSupabaseServer } from '@/backend/supabase'
import { PostsFeed } from '@/frontend/components/PostsFeed'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        제주 곳곳의 미활용 자원을 기록하고, 필요한 사람과 잇습니다.
        있어요·구해요로 자원을 발견해보세요.
      </p>
      <PostsFeed posts={posts} isLoggedIn={!!user} />
    </main>
  )
}
