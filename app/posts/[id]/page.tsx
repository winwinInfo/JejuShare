import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/backend/supabase'
import { getPostById } from '@/backend/queries/posts'
import { getLikeStatus, getLikeCount } from '@/backend/queries/likes'
import { getEmailSentStatus } from '@/backend/queries/email'
import { PostActions } from '@/frontend/components/PostActions'

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

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner = user?.id === post.author.id

  const [liked, likeCount, emailSent, postRow] = await Promise.all([
    getLikeStatus(post.id),
    getLikeCount(post.id),
    getEmailSentStatus(post.id),
    supabase.from('posts').select('contact_email').eq('id', post.id).single(),
  ])

  const hasContactEmail = !!postRow.data?.contact_email

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

        <PostActions
          postId={post.id}
          initialLiked={liked}
          initialLikeCount={likeCount}
          emailSent={emailSent}
          hasContactEmail={hasContactEmail}
          isOwner={isOwner}
          isLoggedIn={!!user}
        />
      </article>
    </main>
  )
}
