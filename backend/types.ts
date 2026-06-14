import type { Enums } from '@/backend/database.types'

export type PostType = Enums<'post_type'>   // 'offer' | 'request'
export type PostStatus = Enums<'post_status'> // 'active' | 'closed'

/** posts 목록/카드에 노출되는 공개 표현 */
export type Post = {
  id: number
  postType: PostType
  title: string
  body: string
  region: string
  imageUrl: string | null
  amount: string | null
  timing: string | null
  status: PostStatus
  createdAt: string
  author: {
    id: string
    nickname: string
  }
}
