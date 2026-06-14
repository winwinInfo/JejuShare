import type { PostType } from '@/backend/types'

export const TYPE_LABEL: Record<PostType, string> = {
  offer: '있어요',
  request: '구해요',
}

/** 뱃지 배경/글자 (연한 톤) */
const TYPE_STYLE: Record<PostType, string> = {
  offer: 'bg-emerald-50 text-emerald-700',
  request: 'bg-amber-50 text-amber-700',
}

/** 뱃지 안의 컬러 점 — 필터 칩·카드 테두리와 동일 색 */
const TYPE_DOT: Record<PostType, string> = {
  offer: 'bg-emerald-500',
  request: 'bg-amber-500',
}

/** 카드 좌측 테두리 색 (한눈에 유형 구분) */
export const TYPE_BORDER: Record<PostType, string> = {
  offer: 'border-l-emerald-500',
  request: 'border-l-amber-500',
}

export function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLE[type]}`}
    >
      <span className={`size-1.5 rounded-full ${TYPE_DOT[type]}`} />
      {TYPE_LABEL[type]}
    </span>
  )
}
