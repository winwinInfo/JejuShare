import { notFound } from 'next/navigation'
import { stories } from '@/content/stories/index'
import { StoryLayout } from '@/frontend/components/story'

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }))
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = stories.find((s) => s.slug === slug)
  if (!entry) notFound()

  const { component: Story } = entry

  return (
    <StoryLayout meta={entry}>
      <Story />
    </StoryLayout>
  )
}
