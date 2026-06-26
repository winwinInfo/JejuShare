export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <div className="font-mono text-xs text-muted-foreground">← 도감으로</div>

      <article className="mt-6 space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-14 rounded-full bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <div className="h-7 w-3/4 rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        </div>

        {/* 대표 이미지 자리 */}
        <div className="aspect-[4/3] w-full rounded-xl bg-muted" />

        {/* 발생량/시기 자리 */}
        <div className="space-y-px rounded-xl border border-border">
          <div className="flex gap-4 p-4">
            <div className="h-4 w-24 shrink-0 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="flex gap-4 p-4">
            <div className="h-4 w-24 shrink-0 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        </div>

        <hr className="border-border" />

        {/* 본문 자리 */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>

        {/* 액션 버튼 자리 */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-12 w-20 rounded-xl bg-muted" />
          <div className="h-12 flex-1 rounded-xl bg-muted" />
        </div>
      </article>
    </main>
  )
}
