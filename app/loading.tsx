// 홈(피드) 진입/이동 시 즉시 보이는 스켈레톤. HomeTabs(탭 + 카드 그리드) 레이아웃에 맞춤.
function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border border-l-4">
      <div className="aspect-[4/3] bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 rounded-full bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="mt-1 flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-10 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="animate-pulse">
        {/* 탭 바 자리 */}
        <div className="mb-6 flex gap-3">
          <div className="h-8 w-20 rounded-lg bg-muted" />
          <div className="h-8 w-16 rounded-lg bg-muted" />
          <div className="h-8 w-16 rounded-lg bg-muted" />
        </div>

        {/* 카드 그리드 자리 (1/2/3열) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
