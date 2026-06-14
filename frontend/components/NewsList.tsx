'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { StoryMeta } from '@/content/stories/index'
import { SearchInput } from '@/frontend/components/SearchInput'

export function NewsList({ items }: { items: StoryMeta[] }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((s) =>
      [s.title, s.summary].some((field) => field.toLowerCase().includes(q))
    )
  }, [items, query])

  return (
    <div>
      <div className="mb-8 max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="늬우스 검색 (예: 감귤박)"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 등록된 늬우스가 없습니다.</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          ‘{query.trim()}’에 대한 검색 결과가 없습니다.
        </p>
      ) : (
        <ol className="divide-y divide-border">
          {visible.map((story) => {
            const date = new Date(story.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            return (
              <li key={story.slug}>
                <Link
                  href={`/history/${story.slug}`}
                  className="group flex items-start justify-between gap-6 py-6 hover:opacity-80 transition-opacity"
                >
                  <div className="min-w-0">
                    <p className="text-base font-medium leading-snug group-hover:underline underline-offset-2">
                      {story.title}
                    </p>
                    {story.summary && (
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {story.summary}
                      </p>
                    )}
                  </div>
                  <time
                    className="shrink-0 text-xs text-muted-foreground pt-0.5 tabular-nums"
                    dateTime={story.publishedAt}
                  >
                    {date}
                  </time>
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
