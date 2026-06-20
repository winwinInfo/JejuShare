import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createSupabaseServer } from '@/backend/supabase'
import { getPostById } from '@/backend/queries/posts'
import { getServerUser } from '@/backend/queries/auth'
import { PostForm } from '@/frontend/components/PostForm'

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getServerUser()
  if (!user) redirect('/login')

  const post = await getPostById(Number(id))
  if (!post) notFound()
  // 작성자 본인만 수정 가능
  if (post.author.id !== user.id) redirect(`/posts/${id}`)

  const supabase = await createSupabaseServer()
  const { data: row } = await supabase
    .from('posts')
    .select('contact_email')
    .eq('id', post.id)
    .single()

  return (
    <main className="mx-auto max-w-lg px-5 py-8">
      <Link
        href={`/posts/${post.id}`}
        className="font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        ← 돌아가기
      </Link>

      <h1 className="mt-6 text-xl font-semibold tracking-tight">게시글 수정</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        올린 기록을 고칠 수 있습니다.
      </p>

      <PostForm
        userId={user.id}
        defaultEmail={row?.contact_email ?? user.email ?? ''}
        postId={post.id}
        initial={{
          postType: post.postType,
          title: post.title,
          body: post.body,
          region: post.region,
          imageUrl: post.imageUrl,
          contactEmail: row?.contact_email ?? null,
          amount: post.amount,
          timing: post.timing,
        }}
      />
    </main>
  )
}
