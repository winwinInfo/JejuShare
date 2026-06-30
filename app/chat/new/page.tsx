
import { redirect } from 'next/navigation'
import { getServerUser } from '@/backend/queries/auth'
import { resolveNewChatTarget } from '@/backend/queries/chat'
import { NewChatRoom } from '@/frontend/components/NewChatRoom'

export const metadata = { title: '새 대화' }

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>
}) {
  const { to } = await searchParams

  const user = await getServerUser()
  if (!user) redirect('/login')
  if (!to) redirect('/chat')

  const target = await resolveNewChatTarget(to)

  switch (target.kind) {
    case 'existing':
      redirect(`/chat/${target.conversationId}`)
    case 'self':
    case 'blocked':
    case 'not_found':
      redirect('/chat')
    case 'ok':
      return <NewChatRoom otherUserId={target.otherId} otherNickname={target.otherNickname} />
  }
}
