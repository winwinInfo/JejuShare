import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/backend/queries/auth'
import { getConversations } from '@/backend/queries/chat'

export const metadata = { title: '대화' }

const KST = 'Asia/Seoul'

function whenLabel(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  // 서버(UTC)에서 렌더되므로 타임존을 KST 로 고정해야 대화창과 일치한다.
  const dayOf = (x: Date) => x.toLocaleDateString('ko-KR', { timeZone: KST })
  const sameDay = dayOf(d) === dayOf(now)
  return sameDay
    ? d.toLocaleTimeString('ko-KR', { timeZone: KST, hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('ko-KR', { timeZone: KST, month: 'long', day: 'numeric' })
}

export default async function ChatListPage() {
  const user = await getServerUser()
  if (!user) redirect('/login')

  const conversations = await getConversations()

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">대화</h1>

      {conversations.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          아직 대화가 없습니다. 게시글에서 작성자에게 먼저 말을 걸어보세요.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-foreground/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{c.other.nickname}</span>
                    {c.unread > 0 && (
                      <span className="shrink-0 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {c.lastMessage ?? '대화를 시작해 보세요.'}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {whenLabel(c.lastMessageAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
