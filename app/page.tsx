import { getAllSpecies } from '@/frontend/data/mock'
import { SpeciesGrid } from '@/frontend/components/SpeciesGrid'

export default function Home() {
  const species = getAllSpecies()

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">도감</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          제주에서 발생하는 미활용 농수산·가공·생활 부산물을 종(種) 단위로
          기록합니다. 각 항목에서 발생처와 활용 아이디어를 살펴보세요.
        </p>
      </div>
      <SpeciesGrid species={species} />
    </main>
  )
}
