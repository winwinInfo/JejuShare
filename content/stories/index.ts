import type { ComponentType } from 'react'

export type StoryMeta = {
  slug: string
  title: string
  summary: string
  publishedAt: string
  coverImage?: string
}

export type StoryEntry = StoryMeta & {
  component: ComponentType
}

// 새 글을 추가할 때: 파일 생성 후 이 배열에 항목 추가 (최신순 정렬 유지)
import GamgyulStory from './gamgyul-upcycle'

export const stories: StoryEntry[] = [
  {
    slug: 'gamgyul-upcycle',
    title: '감귤박, 버려지다가 다시 쓰이다',
    summary: '서귀포 농가에서 매년 쏟아지는 감귤박이 새로운 원료로 거듭나기까지의 기록.',
    publishedAt: '2026-06-10',
    coverImage: undefined,
    component: GamgyulStory,
  },
]
