import { notFound, redirect } from 'next/navigation'
import { getServerUser } from '@/backend/queries/auth'
import { getConversationDetail } from '@/backend/queries/chat'
import { ChatRoom } from '@/frontend/components/ChatRoom'

export const metadata = { title: '대화' }

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const conversationId = Number(id)
  if (!Number.isInteger(conversationId)) notFound()

  const user = await getServerUser()
  if (!user) redirect('/login')

  const detail = await getConversationDetail(conversationId)
  if (!detail) notFound()

  return (
    <ChatRoom
      conversationId={detail.id}
      currentUserId={detail.currentUserId}
      otherNickname={detail.other.nickname}
      initialMessages={detail.messages}
    />
  )
}
