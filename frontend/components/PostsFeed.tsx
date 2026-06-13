import type { Post } from '@/backend/types'
import { PostCard } from '@/frontend/components/PostCard'

export function PostsFeed({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p>아직 등록된 게시글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
