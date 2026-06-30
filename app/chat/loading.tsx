// 대화 목록 진입/이동 시 스켈레톤. ChatListPage 레이아웃에 맞춤.
export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">대화</h1>

      <ul className="animate-pulse divide-y divide-border rounded-xl border border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
            <div className="h-3 w-10 shrink-0 rounded bg-muted" />
          </li>
        ))}
      </ul>
    </main>
  )
}
