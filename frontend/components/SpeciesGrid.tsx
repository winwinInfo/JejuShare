import { Species } from '@/backend/types'
import { SpeciesCard } from '@/frontend/components/SpeciesCard'

export function SpeciesGrid({ species }: { species: Species[] }) {
  if (species.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p>아직 기록된 종이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {species.map((s) => (
        <SpeciesCard key={s.id} species={s} />
      ))}
    </div>
  )
}
