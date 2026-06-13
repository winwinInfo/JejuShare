import { getPosts } from '@/backend/queries/posts'
import { PostsFeed } from '@/frontend/components/PostsFeed'

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">도감</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들.
        </p>
      </div>
      <PostsFeed posts={posts} />
    </main>
  )
}
