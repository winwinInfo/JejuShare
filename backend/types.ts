import type { Enums } from '@/backend/database.types'

export type PostType = Enums<'post_type'>   // 'offer' | 'request'
export type PostStatus = Enums<'post_status'> // 'active' | 'closed'

/** 새활용 이력 단건 */
export type Story = {
  id: number
  title: string
  summary: string | null
  body: string
  coverImageUrl: string | null
  matchId: number | null
  published: boolean
  publishedAt: string | null
  createdAt: string
}

/** posts 목록/카드에 노출되는 공개 표현 */
export type Post = {
  id: number
  postType: PostType
  title: string
  body: string
  region: string
  imageUrl: string | null
  status: PostStatus
  createdAt: string
  author: {
    id: string
    nickname: string
  }
}
