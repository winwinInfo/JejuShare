import { getPosts } from '@/backend/queries/posts'
import { createSupabaseServer } from '@/backend/supabase'
import { PostsFeed } from '@/frontend/components/PostsFeed'
import { HomeIntro } from '@/frontend/components/HomeIntro'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <HomeIntro />
      <PostsFeed posts={posts} isLoggedIn={!!user} />
    </main>
  )
}
