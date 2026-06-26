import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostDetail } from '@/backend/queries/posts'
import { getServerUser } from '@/backend/queries/auth'
import { PostActions } from '@/frontend/components/PostActions'
import { PostOwnerActions } from '@/frontend/components/PostOwnerActions'
import { PostTypeBadge } from '@/frontend/components/PostTypeBadge'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const postId = Number(id)

  // getServerUser는 JWT 로컬 검증(네트워크 0). 실제 데이터는 getPostDetail이 왕복 1회로 가져온다.
  const user = await getServerUser()
  const detail = await getPostDetail(postId, user?.id ?? null)

  if (!detail) notFound()

  const { post, liked, likeCount, emailSent, hasContactEmail } = detail

  const isOwner = user?.id === post.author.id

  // 답장 이메일 프리필용. JWT 클레임의 email로 충분(DB 재조회 불필요).
  const userEmail = user?.email ?? ''

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
