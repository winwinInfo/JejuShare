import { stories } from '@/content/stories/index'
import { NewsList } from '@/frontend/components/NewsList'

export default function HistoryPage() {
  const items = [...stories]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    // 직렬화 가능한 메타만 클라이언트로 전달 (component 제외)
    .map(({ slug, title, summary, publishedAt, coverImage }) => ({
      slug,
      title,
      summary,
      publishedAt,
      coverImage,
    }))

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">새활용 늬우스</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          제주의 버려지는 자원이 다시 쓰인 기록들.
        </p>
      </div>

      <NewsList items={items} />
    </main>
  )
}
