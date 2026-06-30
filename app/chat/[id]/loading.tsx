// 대화방 진입/이동 시 스켈레톤. ChatShell(헤더 + 본문 + 입력) 레이아웃에 맞춤.
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <div className="flex h-[calc(100dvh-13rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-white">
        {/* 헤더 */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="font-mono text-xs text-muted-foreground">←</span>
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>

        {/* 메시지 영역 */}
        <div className="flex flex-1 animate-pulse flex-col gap-3 p-4">
          <div className="h-10 w-2/3 self-start rounded-2xl bg-muted" />
          <div className="h-8 w-1/2 self-end rounded-2xl bg-muted" />
          <div className="h-12 w-3/5 self-start rounded-2xl bg-muted" />
          <div className="h-8 w-2/5 self-end rounded-2xl bg-muted" />
          <div className="h-10 w-1/2 self-start rounded-2xl bg-muted" />
        </div>

        {/* 입력 영역 */}
        <div className="border-t border-border p-3">
          <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
