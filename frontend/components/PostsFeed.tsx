'use client'

import { useState } from 'react'
import type { Post, PostType } from '@/backend/types'
import { PostCard } from '@/frontend/components/PostCard'

type Filter = 'all' | PostType

const FILTERS: {
  key: Filter
  label: string
  dot?: string
  active: string
}[] = [
  { key: 'all', label: '전체', active: 'bg-foreground text-background border-foreground' },
  { key: 'offer', label: '있어요', dot: 'bg-emerald-500', active: 'bg-emerald-600 text-white border-emerald-600' },
  { key: 'request', label: '구해요', dot: 'bg-amber-500', active: 'bg-amber-600 text-white border-amber-600' },
]

export function PostsFeed({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts: Record<Filter, number> = {
    all: posts.length,
    offer: posts.filter((p) => p.postType === 'offer').length,
    request: posts.filter((p) => p.postType === 'request').length,
  }

  const visible = filter === 'all' ? posts : posts.filter((p) => p.postType === filter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map(({ key, label, dot, active }) => {
          const isActive = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={isActive}
              className={[
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                isActive
                  ? active
                  : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              ].join(' ')}
            >
              {dot && (
                <span
                  className={[
                    'size-1.5 rounded-full',
                    isActive ? 'bg-current' : dot,
                  ].join(' ')}
                />
              )}
              {label}
              <span className={isActive ? 'opacity-80' : 'opacity-60'}>{counts[key]}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          <p>{posts.length === 0 ? '아직 등록된 게시글이 없습니다.' : '해당하는 게시글이 없습니다.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
