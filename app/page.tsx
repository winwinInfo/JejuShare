import { getPosts } from '@/backend/queries/posts'
import { getServerUser } from '@/backend/queries/auth'
import { PostsFeed } from '@/frontend/components/PostsFeed'
import { HomeIntro } from '@/frontend/components/HomeIntro'

export default async function Home() {
  const [user, posts] = await Promise.all([getServerUser(), getPosts()])

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <HomeIntro />
      <PostsFeed posts={posts} isLoggedIn={!!user} />
    </main>
  )
}
