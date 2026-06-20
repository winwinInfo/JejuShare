import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
import { LogoutButton } from '@/frontend/components/LogoutButton'
import { ProfileEditForm } from '@/frontend/components/ProfileEditForm'
import { PostCard } from '@/frontend/components/PostCard'
import { getMyPosts } from '@/backend/queries/posts'
import { getLikedPosts } from '@/backend/queries/likes'
import { getEmailedPosts } from '@/backend/queries/email'

export default async function MyPage() {
  const user = await getServerUser()
  if (!user) redirect('/login')

  const supabase = await createSupabaseServer()
  const [profile, myPosts, likedPosts, emailedPosts] = await Promise.all([
    supabase.from('user').select('nickname, phone, bio, created_at').eq('id', user.id).single().then(r => r.data),
    getMyPosts(),
    getLikedPosts(),
    getEmailedPosts(),
  ])

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
        <LogoutButton />
      </div>

      <div className="space-y-4">
        {/* 계정 정보 */}
        <div className="border border-border rounded-xl p-6 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">계정</h2>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-sm text-muted-foreground">이메일</dt>
            <dd className="text-sm">{user.email}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-sm text-muted-foreground">가입일</dt>
            <dd className="text-sm">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('ko-KR')
                : '—'}
            </dd>
          </div>
        </div>

        <ProfileEditForm
          initial={{
            nickname: profile?.nickname ?? null,
            phone: profile?.phone ?? null,
            bio: profile?.bio ?? null,
          }}
        />

        {/* 내가 작성한 글 */}
        <div className="border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            내가 작성한 글 <span className="text-foreground normal-case">({myPosts.length})</span>
          </h2>
          {myPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 작성한 게시글이 없습니다.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {myPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 좋아요한 글 */}
        <div className="border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            좋아요한 글 <span className="text-foreground normal-case">({likedPosts.length})</span>
          </h2>
          {likedPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 좋아요한 게시글이 없습니다.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {likedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 이메일 보낸 글 */}
        <div className="border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            이메일 보낸 글 <span className="text-foreground normal-case">({emailedPosts.length})</span>
          </h2>
          {emailedPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 이메일을 보낸 게시글이 없습니다.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {emailedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
