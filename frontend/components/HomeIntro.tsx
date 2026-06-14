const STEPS = [
  {
    n: '1',
    title: '발견',
    body: '있어요·구해요 글을 둘러보거나 검색해 원하는 자원을 찾습니다.',
  },
  {
    n: '2',
    title: '연락',
    body: '마음에 드는 글에서 작성자에게 이메일로 관심을 전합니다.',
  },
  {
    n: '3',
    title: '거래',
    body: '작성자와 직접 연결되어 자원을 주고받습니다.',
  },
]

export function HomeIntro() {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 sm:p-7">
      <p className="break-keep text-sm leading-relaxed text-foreground/90">
        <span className="font-medium">제주 새활용 도감</span>은 제주에서 버려지는 농수산
        부산물을 기록하고,{' '}
        <span className="whitespace-nowrap">
          <span className="inline-block size-1.5 translate-y-px rounded-full bg-emerald-500" />{' '}
          있어요
        </span>
        (자원 보유자)와{' '}
        <span className="whitespace-nowrap">
          <span className="inline-block size-1.5 translate-y-px rounded-full bg-amber-500" />{' '}
          구해요
        </span>
        (자원 수요자)를 잇는 공간입니다.
      </p>

      <ol className="mt-6 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
              {s.n}
            </span>
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
