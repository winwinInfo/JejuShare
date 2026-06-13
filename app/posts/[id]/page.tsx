import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostById } from '@/backend/queries/posts'

const TYPE_LABEL = { offer: '있어요', request: '구해요' }
const TYPE_STYLE = {
  offer: 'bg-emerald-50 text-emerald-700',
  request: 'bg-amber-50 text-amber-700',
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPostById(Number(id))

  if (!post) notFound()

  const dateLabel = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        ← 도감으로
      </Link>

      <article className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLE[post.postType]}`}>
              {TYPE_LABEL[post.postType]}
            </span>
            <span className="text-xs text-muted-foreground">{post.region}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author.nickname}</span>
            <span>·</span>
            <span>{dateLabel}</span>
          </div>
        </div>

        {post.imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <hr className="border-border" />

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.body}</p>

        <div className="pt-4">
          <button
            className="w-full bg-foreground text-background py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            관심 있어요
          </button>
        </div>
      </article>
    </main>
  )
}
