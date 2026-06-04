import { UseIdea } from '@/backend/types'
import { Card } from '@/frontend/components/ui/card'

export function UseIdeaList({ ideas }: { ideas: UseIdea[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold tracking-tight">활용 아이디어</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {ideas.length}건
        </span>
      </div>

      {ideas.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 기록된 활용 아이디어가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <Card key={idea.id} className="space-y-2 p-5">
              <h4 className="font-medium tracking-tight">{idea.title}</h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {idea.body}
              </p>
              <p className="pt-1 text-xs text-muted-foreground">
                기여 · {idea.contributor.displayName}
                {idea.contributor.bio ? ` — ${idea.contributor.bio}` : ''}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
