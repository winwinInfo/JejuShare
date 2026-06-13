import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/backend/supabase'
import { LogoutButton } from '@/frontend/components/LogoutButton'
import { ProfileEditForm } from '@/frontend/components/ProfileEditForm'

export default async function MyPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user')
    .select('nickname, phone, bio, created_at')
    .eq('id', user.id)
    .single()

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
        <LogoutButton />
      </div>

      <div className="space-y-4">
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
      </div>
    </main>
  )
}
