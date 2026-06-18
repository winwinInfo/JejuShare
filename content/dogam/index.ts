/**
 * 도감 항목은 순수 데이터(타입 있는 TS 객체)로 정의한다.
 * 새 부산물을 추가할 때: 이 배열에 객체 하나만 추가하면 된다.
 *
 * 나중에 DB로 옮길 때 이 필드들이 그대로 테이블 컬럼이 된다. (uses는 text[] 또는 jsonb)
 */

export type DogamItem = {
  slug: string
  name: string
  /** 분류 (예: 농산부산물, 식품부산물) */
  category: string
  /** 이명 (선택) */
  aliases?: string[]
  /** 짧은 설명 */
  summary: string
  /** 활용처 태그 */
  uses: string[]
  coverImage?: string
  updatedAt: string
}

export const dogamItems: DogamItem[] = [
  {
    slug: 'gamgyul-bak',
    name: '감귤박',
    category: '농산부산물',
    aliases: ['감귤 착즙박'],
    summary:
      '감귤을 착즙하고 남는 껍질·과육 찌꺼기. 착즙 시즌인 늦가을~겨울에 제주 곳곳에서 대량으로 발생한다. 수분이 많아 부패가 빨라 빠른 처리가 필요하지만, 플라보노이드·펙틴 등 쓸모 있는 성분이 풍부하다.',
    uses: ['화장품 원료', '천연 염료', '식품 소재', '퇴비·사료'],
    updatedAt: '2026-06-01',
  },
  {
    slug: 'keopi-bak',
    name: '커피박',
    category: '식품부산물',
    aliases: ['커피 찌꺼기', 'SCG'],
    summary:
      '커피를 추출하고 남는 찌꺼기. 제주 전역의 카페에서 연중 꾸준히 발생한다. 수분을 머금어 방치하면 곰팡이가 피지만, 질소가 풍부해 퇴비와 버섯 배지로 활용 가치가 높다.',
    uses: ['퇴비·토양 개량', '버섯 배지', '탈취·방충', '바이오 소재'],
    updatedAt: '2026-06-01',
  },
]
