import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/backend/supabase'
import { getPostById } from '@/backend/queries/posts'
import { getLikeStatus, getLikeCount } from '@/backend/queries/likes'
import { getEmailSentStatus } from '@/backend/queries/email'
import { PostActions } from '@/frontend/components/PostActions'
import { PostOwnerActions } from '@/frontend/components/PostOwnerActions'
import { PostTypeBadge } from '@/frontend/components/PostTypeBadge'

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

  const [liked, likeCount, emailSent, postRow, userProfile] = await Promise.all([
    getLikeStatus(post.id),
    getLikeCount(post.id),
    getEmailSentStatus(post.id),
    supabase.from('posts').select('contact_email').eq('id', post.id).single(),
    user ? supabase.from('user').select('email').eq('id', user.id).single() : Promise.resolve({ data: null }),
  ])

  const hasContactEmail = !!postRow.data?.contact_email
  const userEmail = userProfile.data?.email ?? user?.email ?? ''

  const dateLabel = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const amountLabel = post.postType === 'offer' ? '발생하는 양' : '필요한 양'
  const timingLabel = post.postType === 'offer' ? '발생 시기' : '필요한 시기'

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
            <PostTypeBadge type={post.postType} />
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

        {(post.amount || post.timing) && (
          <dl className="rounded-xl border border-border divide-y divide-border text-sm">
            {post.amount && (
              <div className="flex gap-4 p-4">
                <dt className="w-24 shrink-0 text-muted-foreground">{amountLabel}</dt>
                <dd className="font-medium">{post.amount}</dd>
              </div>
            )}
            {post.timing && (
              <div className="flex gap-4 p-4">
                <dt className="w-24 shrink-0 text-muted-foreground">{timingLabel}</dt>
                <dd className="font-medium">{post.timing}</dd>
              </div>
            )}
          </dl>
        )}

        <hr className="border-border" />

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.body}</p>

        {isOwner ? (
          <PostOwnerActions postId={post.id} />
        ) : (
          <PostActions
            postId={post.id}
            initialLiked={liked}
            initialLikeCount={likeCount}
            emailSent={emailSent}
            hasContactEmail={hasContactEmail}
            isOwner={isOwner}
            isLoggedIn={!!user}
            userEmail={userEmail}
          />
        )}
      </article>
    </main>
  )
}
