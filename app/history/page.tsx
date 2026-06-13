import Link from 'next/link'
import { stories } from '@/content/stories/index'

export default function HistoryPage() {
  const sorted = [...stories].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight">새활용 이력</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          제주의 버려지는 자원이 다시 쓰인 기록들.
        </p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 등록된 이력이 없습니다.</p>
      ) : (
        <ol className="divide-y divide-border">
          {sorted.map((story) => {
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
    </main>
  )
}
