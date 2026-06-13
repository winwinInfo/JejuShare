import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getStoryById } from '@/backend/queries/stories'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const story = await getStoryById(Number(id))
  if (!story) notFound()

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/history"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← 새활용 이력으로
      </Link>

      {story.coverImageUrl && (
        <img
          src={story.coverImageUrl}
          alt={story.title}
          className="mt-6 w-full rounded-lg object-cover max-h-72"
        />
      )}

      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold leading-snug tracking-tight">
          {story.title}
        </h1>
        <time
          className="mt-2 block text-xs text-muted-foreground tabular-nums"
          dateTime={story.publishedAt ?? story.createdAt}
        >
          {formatDate(story.publishedAt ?? story.createdAt)}
        </time>
      </header>

      <article className="prose prose-stone mt-8 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{story.body}</ReactMarkdown>
      </article>
    </main>
  )
}
