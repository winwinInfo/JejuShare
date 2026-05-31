import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Item } from '@/lib/types'

async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, owners(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }
  return data as Item[]
}

export default async function Home() {
  const items = await getItems()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-green-700">제주 농업부산물 나눔</h1>
            <p className="text-xs text-gray-500 mt-0.5">제주시 농업 부산물 공유 플랫폼</p>
          </div>
          <Link
            href="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            + 등록하기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">등록된 부산물이 없습니다.</p>
            <p className="text-sm mt-2">첫 번째로 등록해보세요!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {item.type ?? '종류 미상'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {item.usage && (
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    활용처: {item.usage}
                  </p>
                )}

                {item.description?.detail && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {item.description.detail}
                  </p>
                )}

                {item.owners && (
                  <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
                    {item.owners.location?.address && (
                      <p className="text-xs text-gray-500">
                        📍 {item.owners.location.address}
                      </p>
                    )}
                    {item.owners.phone && (
                      <p className="text-xs text-gray-500">
                        📞 {item.owners.phone}
                      </p>
                    )}
                    {item.owners.email && (
                      <p className="text-xs text-gray-500">
                        ✉️ {item.owners.email}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
