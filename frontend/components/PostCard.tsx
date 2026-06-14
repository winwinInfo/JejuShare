import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/backend/types'
import { PostTypeBadge, TYPE_BORDER } from '@/frontend/components/PostTypeBadge'

export function PostCard({ post }: { post: Post }) {
  const relativeDate = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' })
  const diffDays = Math.round(
    (new Date(post.createdAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const dateLabel =
    Math.abs(diffDays) < 1
      ? '오늘'
      : relativeDate.format(diffDays, 'day')

  return (
    <Link
      href={`/posts/${post.id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border border-l-4 ${TYPE_BORDER[post.postType]} bg-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white p-3">
            <Image
              src="/og-image.png"
              alt=""
              width={596}
              height={530}
              className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <PostTypeBadge type={post.postType} />
          <span className="text-xs text-muted-foreground">{post.region}</span>
        </div>

        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-2">
          {post.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {post.body}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{post.author.nickname}</span>
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
        </div>
      </div>
    </Link>
  )
}
