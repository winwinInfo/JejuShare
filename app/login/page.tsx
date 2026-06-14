import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/frontend/components/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* 브랜드 */}
        <div className="text-center">
          <Image
            src="/apple-touch-icon.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto"
            priority
          />
          <h1
            className="mt-4 text-2xl font-semibold tracking-tight"
            style={{ fontFamily: '"EutmanGungseo", serif' }}
          >
            제주 새활용 도감
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            제주의 버려지는 자원을 함께 발견하고, 기록하고,
            <br className="sm:hidden" /> 다시 쓰는 사람들
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-center text-base font-medium">카카오로 시작하기</h2>
          <p className="mt-1.5 text-center text-xs leading-relaxed text-muted-foreground">
            비밀번호 없이 3초 만에 시작할 수 있어요.
          </p>

          <div className="mt-6 flex justify-center">
            <LoginForm />
          </div>

          <div className="mt-7 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            <span className="h-px flex-1 bg-border" />
            안내
            <span className="h-px flex-1 bg-border" />
          </div>
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span aria-hidden className="text-muted-foreground/50">·</span>
              이메일은 카카오에서만 수집하며 외부에 공개되지 않습니다.
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-muted-foreground/50">·</span>
              연락처는 매칭을 수락한 상대에게만 공개됩니다.
            </li>
          </ul>
        </div>

        {/* 비로그인 탈출구 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">
            로그인 없이 도감 둘러보기 →
          </Link>
        </p>
      </div>
    </main>
  )
}
