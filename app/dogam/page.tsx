import { dogamItems } from '@/content/dogam/index'
import { DogamList } from '@/frontend/components/DogamList'

export default function DogamPage() {
  const items = [...dogamItems].sort((a, b) => a.name.localeCompare(b.name, 'ko'))

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">도감</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          제주에서 버려지는 부산물은 어떤 것이 있고, 어디에 다시 쓰일 수 있는가.
        </p>
      </div>

      <DogamList items={items} />
    </main>
  )
}
