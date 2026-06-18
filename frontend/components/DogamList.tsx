'use client'

import { useMemo, useState } from 'react'
import type { DogamItem } from '@/content/dogam/index'
import { SearchInput } from '@/frontend/components/SearchInput'

export function DogamList({ items }: { items: DogamItem[] }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) =>
      [
        item.name,
        item.summary,
        item.category,
        ...(item.aliases ?? []),
        ...item.uses,
      ].some((field) => field.toLowerCase().includes(q)),
    )
  }, [items, query])

  return (
    <div>
      <div className="mb-8 max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="부산물 검색 (예: 감귤박, 퇴비)"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 등록된 도감 항목이 없습니다.</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          ‘{query.trim()}’에 대한 검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {visible.map((item) => (
            <DogamCard key={item.slug} item={item} />
          ))}
        </ul>
      )}
    </div>
  )
}

function DogamCard({ item }: { item: DogamItem }) {
  return (
    <li className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <span className="font-mono text-xs text-muted-foreground">{item.category}</span>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">{item.name}</h3>
      {item.aliases && item.aliases.length > 0 && (
        <p className="mt-0.5 text-xs text-muted-foreground">{item.aliases.join(' · ')}</p>
      )}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">{item.summary}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {item.uses.map((use) => (
          <span
            key={use}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
          >
            {use}
          </span>
        ))}
      </div>
    </li>
  )
}
