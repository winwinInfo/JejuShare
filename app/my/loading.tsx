// 마이페이지 진입/이동 시 스켈레톤. MyPage(계정 카드 + 프로필 + 글 목록) 레이아웃에 맞춤.
function SectionSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-border p-6">
      <div className="h-3 w-16 rounded bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-24 shrink-0 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

function PostsSectionSkeleton() {
  return (
    <div className="rounded-xl border border-border p-6">
      <div className="mb-4 h-3 w-28 rounded bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border">
            <div className="aspect-[4/3] bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
      </div>

      <div className="animate-pulse space-y-4">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={3} />
        <PostsSectionSkeleton />
        <PostsSectionSkeleton />
      </div>
    </main>
  )
}
