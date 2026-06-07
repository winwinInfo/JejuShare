import { LoginForm } from '@/frontend/components/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">로그인</h1>
        <p className="text-sm text-muted-foreground mb-8">
          이메일로 로그인 링크를 보내드립니다.
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
