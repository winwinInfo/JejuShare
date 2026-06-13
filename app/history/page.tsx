import Link from 'next/link'
import { getStories } from '@/backend/queries/stories'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function HistoryPage() {
  const stories = await getStories()

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight">새활용 이력</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          제주의 버려지는 자원이 다시 쓰인 기록들.
        </p>
      </div>

      {stories.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 등록된 이력이 없습니다.</p>
      ) : (
        <ol className="divide-y divide-border">
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/history/${story.id}`}
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
                  dateTime={story.publishedAt ?? story.createdAt}
                >
                  {formatDate(story.publishedAt ?? story.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
