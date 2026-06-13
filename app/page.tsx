import { getPosts } from '@/backend/queries/posts'
import { PostsFeed } from '@/frontend/components/PostsFeed'

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">도감</h2>
      </div>
      <PostsFeed posts={posts} />
    </main>
  )
}
