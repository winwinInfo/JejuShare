import { SourcePublic } from '@/backend/types'
import { Card } from '@/frontend/components/ui/card'

export function SourceList({ sources }: { sources: SourcePublic[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold tracking-tight">발생처</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {sources.length}곳
        </span>
      </div>

      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 등록된 발생처가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {sources.map((s) => (
            <Card key={s.id} className="flex flex-wrap gap-x-6 gap-y-2 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{s.sourceName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {s.region}
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                {s.quantityEstimate && <span>{s.quantityEstimate}</span>}
                {s.frequency && <span>{s.frequency}</span>}
                <StatusTag status={s.status} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        ※ 상세 주소와 보유자 연락처는 매칭 수락 시에만 상대에게 공개됩니다.
      </p>
    </section>
  )
}

function StatusTag({ status }: { status: SourcePublic['status'] }) {
  const active = status === 'active'
  return (
    <span
      className={
        active
          ? 'rounded-full bg-cat-agr-bg px-2 py-0.5 text-cat-agr'
          : 'rounded-full bg-muted px-2 py-0.5 text-muted-foreground'
      }
    >
      {active ? '공급 가능' : '일시 중지'}
    </span>
  )
}
