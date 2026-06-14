'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Post, PostType } from '@/backend/types'
import { PostCard } from '@/frontend/components/PostCard'
import { SearchInput } from '@/frontend/components/SearchInput'

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

export function PostsFeed({ posts, isLoggedIn }: { posts: Post[]; isLoggedIn: boolean }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  // 검색어로 먼저 걸러낸 집합 (칩 건수도 이 기준)
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) =>
      [p.title, p.body, p.region, p.author.nickname]
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [posts, query])

  const counts: Record<Filter, number> = {
    all: searched.length,
    offer: searched.filter((p) => p.postType === 'offer').length,
    request: searched.filter((p) => p.postType === 'request').length,
  }

  const visible = filter === 'all' ? searched : searched.filter((p) => p.postType === filter)

  return (
    <div>
      <div className="mb-4 max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="자원·지역·작성자 검색 (예: 감귤박, 애월)"
        />
      </div>

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
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors',
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
        <div className="py-24 text-center">
          {posts.length === 0 ? (
            <div className="space-y-5">
              <p className="text-muted-foreground">아직 등록된 기록이 없습니다.</p>
              <Link
                href={isLoggedIn ? '/posts/new' : '/login'}
                className="inline-block rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {isLoggedIn ? '첫 글 올리기 →' : '로그인하고 글 올리기 →'}
              </Link>
            </div>
          ) : query.trim() ? (
            <p className="text-muted-foreground">
              ‘{query.trim()}’에 대한 검색 결과가 없습니다.
            </p>
          ) : (
            <p className="text-muted-foreground">해당하는 게시글이 없습니다.</p>
          )}
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
