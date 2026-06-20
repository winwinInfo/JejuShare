import { Suspense } from 'react'
import { getPosts } from '@/backend/queries/posts'
import { getServerUser } from '@/backend/queries/auth'
import { dogamItems } from '@/content/dogam/index'
import { stories } from '@/content/stories/index'
import { HomeTabs } from '@/frontend/components/HomeTabs'

// 정적 도감 항목 (이름순) — 모듈 로드 시 1회 계산
const sortedDogamItems = [...dogamItems].sort((a, b) =>
  a.name.localeCompare(b.name, 'ko'),
)

// 정적 늬우스 메타 (최신순, 직렬화 가능한 필드만 — component 제외)
const storyItems = [...stories]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .map(({ slug, title, summary, publishedAt, coverImage }) => ({
    slug,
    title,
    summary,
    publishedAt,
    coverImage,
  }))

export default async function Home() {
  const [user, posts] = await Promise.all([getServerUser(), getPosts()])

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Suspense>
        <HomeTabs
          posts={posts}
          isLoggedIn={!!user}
          dogamItems={sortedDogamItems}
          stories={storyItems}
        />
      </Suspense>
    </main>
  )
}
