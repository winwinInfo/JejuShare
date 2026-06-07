/*
  제주 새활용 도감 — 공개 화면용 타입 (public-safe)
  연락처(phone/email), detail_address 등 비공개 필드는 의도적으로 제외.
*/

// 부산물 카테고리: 농업/수산/가공/생활(기타)
export type Category = 'AGR' | 'MAR' | 'PRO' | 'LIF'

/** 종 상세/카드에 노출되는 누적 통계 (숫자만) */
export type SpeciesStats = {
  sourceCount: number
  ideaCount: number
  matchCount: number
}

/** species (부산물 종류) — 공개 표현 */
export type Species = {
  id: number
  code: string // 예: JJU-AGR-001
  name: string
  category: Category
  description: string
  coverImageUrl: string | null
  season: string | null
  stats: SpeciesStats
}

/** sources (발생처) — 공개-안전 필드만. detail_address 제외 */
export type SourcePublic = {
  id: number
  sourceName: string
  region: string // 읍/면/동 수준
  quantityEstimate: string | null
  frequency: string | null // 상시/계절/일회성
  status: 'active' | 'inactive'
}

/** 기여자 공개 표현 — 닉네임/한 줄 소개만 */
export type ContributorPublic = {
  displayName: string
  bio?: string | null
}

/** use_ideas (활용 아이디어) — 공개 표현 */
export type UseIdea = {
  id: number
  title: string
  body: string
  contributor: ContributorPublic
  createdAt: string
}
