import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getSpeciesByCode,
  getSourcesByCode,
  getIdeasByCode,
  getAllSpecies,
} from '@/frontend/data/mock'
import { SpeciesHero } from '@/frontend/components/species/SpeciesHero'
import { SourceList } from '@/frontend/components/species/SourceList'
import { UseIdeaList } from '@/frontend/components/species/UseIdeaList'
import { Separator } from '@/frontend/components/ui/separator'

export function generateStaticParams() {
  return getAllSpecies().map((s) => ({ code: s.code }))
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const species = getSpeciesByCode(code)

  if (!species) {
    notFound()
  }

  const sources = getSourcesByCode(code)
  const ideas = getIdeasByCode(code)

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        ← 도감으로
      </Link>

      <div className="mt-6 space-y-12">
        <SpeciesHero species={species} />
        <Separator />
        <SourceList sources={sources} />
        <Separator />
        <UseIdeaList ideas={ideas} />
      </div>
    </main>
  )
}
