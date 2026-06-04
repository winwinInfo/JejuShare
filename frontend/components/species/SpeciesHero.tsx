import { Species } from '@/backend/types'
import { CategoryBadge } from '@/frontend/components/CategoryBadge'
import { CoverPlaceholder } from '@/frontend/components/CoverPlaceholder'

export function SpeciesHero({ species }: { species: Species }) {
  const { stats } = species
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:items-start">
      <div className="overflow-hidden rounded-lg border border-border">
        <CoverPlaceholder
          category={species.category}
          code={species.code}
          imageUrl={species.coverImageUrl}
        />
      </div>

      <div className="space-y-4">
        <p className="font-mono text-sm text-muted-foreground">{species.code}</p>
        <h2 className="text-3xl font-semibold tracking-tight">{species.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={species.category} />
          {species.season && (
            <span className="font-mono text-xs text-muted-foreground">
              발생 시기 · {species.season}
            </span>
          )}
        </div>
        <p className="max-w-2xl leading-relaxed text-foreground/90">
          {species.description}
        </p>

        <dl className="flex gap-8 border-t border-border pt-4">
          <Stat label="발생처" value={stats.sourceCount} />
          <Stat label="활용 아이디어" value={stats.ideaCount} />
          <Stat label="매칭 진행" value={stats.matchCount} />
        </dl>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-mono text-2xl font-semibold tracking-tight">
        {value}
      </dd>
    </div>
  )
}
