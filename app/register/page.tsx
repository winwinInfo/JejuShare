import { createSupabaseServer } from '@/backend/supabase'
import { getServerUser } from '@/backend/queries/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/frontend/components/ProfileForm'

export default async function RegisterPage() {
  const user = await getServerUser()

  if (!user) redirect('/login')

  const supabase = await createSupabaseServer()
  const { data: profile } = await supabase
    .from('user')
    .select('nickname')
    .eq('id', user.id)
    .single()

  if (profile?.nickname) redirect('/')

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">프로필 설정</h1>
        <p className="text-sm text-muted-foreground mb-8">
          처음 오셨군요. 기본 정보를 입력해주세요.
        </p>
        <ProfileForm email={user.email!} />
      </div>
    </main>
  )
}
