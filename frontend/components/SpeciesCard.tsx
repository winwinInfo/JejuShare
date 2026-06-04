import Link from 'next/link'
import { Species } from '@/backend/types'
import { CategoryBadge } from '@/frontend/components/CategoryBadge'
import { CoverPlaceholder } from '@/frontend/components/CoverPlaceholder'
import { Card } from '@/frontend/components/ui/card'

export function SpeciesCard({ species }: { species: Species }) {
  const { stats } = species
  return (
    <Link href={`/species/${species.code}`} className="group block">
      <Card className="overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        <CoverPlaceholder
          category={species.category}
          code={species.code}
          imageUrl={species.coverImageUrl}
        />
        <div className="space-y-2 p-4">
          <p className="font-mono text-xs text-muted-foreground">
            {species.code}
          </p>
          <h3 className="text-lg font-semibold leading-snug tracking-tight">
            {species.name}
          </h3>
          <CategoryBadge category={species.category} />
          <p className="pt-1 font-mono text-xs text-muted-foreground">
            발생처 {stats.sourceCount} · 활용 {stats.ideaCount} · 매칭{' '}
            {stats.matchCount}
          </p>
        </div>
      </Card>
    </Link>
  )
}
