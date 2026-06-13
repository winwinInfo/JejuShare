import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/backend/types'

const TYPE_LABEL: Record<Post['postType'], string> = {
  offer: '있어요',
  request: '구해요',
}

const TYPE_STYLE: Record<Post['postType'], string> = {
  offer: 'bg-emerald-50 text-emerald-700',
  request: 'bg-amber-50 text-amber-700',
}

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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLE[post.postType]}`}>
            {TYPE_LABEL[post.postType]}
          </span>
          <span className="text-xs text-muted-foreground">{post.region}</span>
        </div>

        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground/80">
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
