import { Category } from '@/backend/types'

/** 카테고리별 표시 메타 (라벨 + 뱃지 색상 유틸 클래스) */
export const CATEGORY_META: Record<
  Category,
  { label: string; full: string; badge: string; tint: string; text: string }
> = {
  AGR: {
    label: '농업',
    full: '농업 부산물',
    badge: 'bg-cat-agr-bg text-cat-agr',
    tint: 'bg-cat-agr-bg',
    text: 'text-cat-agr',
  },
  MAR: {
    label: '수산',
    full: '수산 부산물',
    badge: 'bg-cat-mar-bg text-cat-mar',
    tint: 'bg-cat-mar-bg',
    text: 'text-cat-mar',
  },
  PRO: {
    label: '가공',
    full: '가공 부산물',
    badge: 'bg-cat-pro-bg text-cat-pro',
    tint: 'bg-cat-pro-bg',
    text: 'text-cat-pro',
  },
  LIF: {
    label: '생활',
    full: '생활 부산물',
    badge: 'bg-cat-lif-bg text-cat-lif',
    tint: 'bg-cat-lif-bg',
    text: 'text-cat-lif',
  },
}
