'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Post } from '@/backend/types'
import type { DogamItem } from '@/content/dogam/index'
import type { StoryMeta } from '@/content/stories/index'
import { HomeIntro } from '@/frontend/components/HomeIntro'
import { PostsFeed } from '@/frontend/components/PostsFeed'
import { DogamList } from '@/frontend/components/DogamList'
import { NewsList } from '@/frontend/components/NewsList'

type Tab = 'posts' | 'dogam' | 'news'

const TABS: { key: Tab; label: string }[] = [
  { key: 'posts', label: '게시물' },
  { key: 'dogam', label: '도감' },
  { key: 'news', label: '새활용 늬우스' },
]

function toTab(value: string | null): Tab {
  return value === 'dogam' || value === 'news' ? value : 'posts'
}

export function HomeTabs({
  posts,
  isLoggedIn,
  dogamItems,
  stories,
}: {
  posts: Post[]
  isLoggedIn: boolean
  dogamItems: DogamItem[]
  stories: StoryMeta[]
}) {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(toTab(searchParams.get('tab')))

  function selectTab(next: Tab) {
    setTab(next)
    // 서버 재렌더 없이 URL만 갱신 → 공유·새로고침 시 동일 탭 유지
    const url = next === 'posts' ? '/' : `/?tab=${next}`
    window.history.replaceState(null, '', url)
  }

  return (
    <div>
      <div className="mb-8 border-b border-border">
        <nav className="flex">
          {TABS.map(({ key, label }) => {
            const isActive = tab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectTab(key)}
                aria-pressed={isActive}
                className={[
                  'inline-block px-5 py-2.5 text-sm text-center border-b-2 transition-colors',
                  isActive
                    ? 'border-foreground text-foreground font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </nav>
      </div>

      {tab === 'posts' && (
        <>
          <HomeIntro />
          <PostsFeed posts={posts} isLoggedIn={isLoggedIn} />
        </>
      )}
      {tab === 'dogam' && (
        <>
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">
              제주에서 버려지는 부산물은 어떤 것이 있고, 어디에 다시 쓰일 수 있는가.
            </p>
          </div>
          <DogamList items={dogamItems} />
        </>
      )}
      {tab === 'news' && (
        <>
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">
              제주의 버려지는 자원이 다시 쓰인 기록들.
            </p>
          </div>
          <NewsList items={stories} />
        </>
      )}
    </div>
  )
}
