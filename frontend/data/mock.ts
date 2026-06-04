import { Species, SourcePublic, UseIdea } from '@/backend/types'

/*
  제주 새활용 도감 — 개발용 mock 데이터.
  실제 Supabase 연동 전까지 프론트 독립 작업을 위한 더미.
  ※ 공개-안전 필드만 포함 (연락처/상세주소 없음).
*/

export const species: Species[] = [
  {
    id: 1,
    code: 'JJU-AGR-001',
    name: '감귤박',
    category: 'AGR',
    description:
      '감귤을 착즙·가공하고 남은 과피와 펄프. 펙틴과 식이섬유가 풍부해 사료·퇴비·바이오소재 원료로 주목받는다.',
    coverImageUrl: null,
    season: '11월–이듬해 2월',
    stats: { sourceCount: 6, ideaCount: 9, matchCount: 4 },
  },
  {
    id: 2,
    code: 'JJU-AGR-002',
    name: '당근 잎·줄기',
    category: 'AGR',
    description:
      '구좌 지역 당근 수확 후 밭에 남는 잎과 줄기. 수분이 많아 즉시 활용이 어렵지만 발효 사료·퇴비화 가능성이 높다.',
    coverImageUrl: null,
    season: '11월–1월',
    stats: { sourceCount: 4, ideaCount: 5, matchCount: 2 },
  },
  {
    id: 3,
    code: 'JJU-AGR-003',
    name: '브로콜리 부산물',
    category: 'AGR',
    description:
      '브로콜리 수확 시 제거되는 잎과 굵은 줄기. 영양 성분이 남아 있어 가축 사료·식품 소재 재활용 연구가 진행 중이다.',
    coverImageUrl: null,
    season: '12월–3월',
    stats: { sourceCount: 3, ideaCount: 4, matchCount: 1 },
  },
  {
    id: 4,
    code: 'JJU-MAR-001',
    name: '굴 껍데기',
    category: 'MAR',
    description:
      '패류 가공 후 대량 발생하는 굴 패각. 탄산칼슘 함량이 높아 토양개량제·건축 소재·비료로 재활용된다.',
    coverImageUrl: null,
    season: '상시',
    stats: { sourceCount: 5, ideaCount: 7, matchCount: 3 },
  },
  {
    id: 5,
    code: 'JJU-MAR-002',
    name: '괭생이모자반',
    category: 'MAR',
    description:
      '해안으로 대량 유입되는 갈조류. 수거·건조 후 비료·바이오플라스틱·기능성 소재 원료로 활용이 모색된다.',
    coverImageUrl: null,
    season: '3월–6월',
    stats: { sourceCount: 2, ideaCount: 3, matchCount: 0 },
  },
  {
    id: 6,
    code: 'JJU-PRO-001',
    name: '맥주박',
    category: 'PRO',
    description:
      '제주 양조장에서 맥주를 거르고 남은 맥아 잔여물. 단백질·식이섬유가 풍부해 사료·베이커리·업사이클 식품 소재로 쓰인다.',
    coverImageUrl: null,
    season: '상시',
    stats: { sourceCount: 4, ideaCount: 8, matchCount: 5 },
  },
  {
    id: 7,
    code: 'JJU-PRO-002',
    name: '감귤 착즙박',
    category: 'PRO',
    description:
      '감귤 주스 가공 라인에서 분리되는 고형 착즙 잔여물. 건조 후 분말화하여 향료·기능성 식품 원료로 가공된다.',
    coverImageUrl: null,
    season: '11월–2월',
    stats: { sourceCount: 3, ideaCount: 6, matchCount: 2 },
  },
  {
    id: 8,
    code: 'JJU-LIF-001',
    name: '커피박',
    category: 'LIF',
    description:
      '카페·로스터리에서 추출 후 버려지는 원두 찌꺼기. 탈취제·화분 배양토·고형연료(펠릿) 등으로 폭넓게 재활용된다.',
    coverImageUrl: null,
    season: '상시',
    stats: { sourceCount: 7, ideaCount: 10, matchCount: 6 },
  },
]

export const sourcesBySpecies: Record<string, SourcePublic[]> = {
  'JJU-AGR-001': [
    {
      id: 101,
      sourceName: '한라산 자락 감귤농장',
      region: '서귀포시 남원읍',
      quantityEstimate: '주 200kg 내외',
      frequency: '계절(수확기)',
      status: 'active',
    },
    {
      id: 102,
      sourceName: '애월 감귤 작목반',
      region: '제주시 애월읍',
      quantityEstimate: '월 1톤 내외',
      frequency: '계절(수확기)',
      status: 'active',
    },
    {
      id: 103,
      sourceName: '효돈 노지감귤 농가',
      region: '서귀포시 효돈동',
      quantityEstimate: '소량(협의)',
      frequency: '일회성',
      status: 'inactive',
    },
  ],
  'JJU-MAR-001': [
    {
      id: 201,
      sourceName: '성산 패류 가공장',
      region: '서귀포시 성산읍',
      quantityEstimate: '주 500kg 내외',
      frequency: '상시',
      status: 'active',
    },
    {
      id: 202,
      sourceName: '한림 수산물 직판장',
      region: '제주시 한림읍',
      quantityEstimate: '월 2톤 내외',
      frequency: '상시',
      status: 'active',
    },
  ],
  'JJU-PRO-001': [
    {
      id: 301,
      sourceName: '제주 크래프트 브루어리',
      region: '제주시 한경면',
      quantityEstimate: '주 300kg 내외',
      frequency: '상시',
      status: 'active',
    },
  ],
  'JJU-LIF-001': [
    {
      id: 401,
      sourceName: '구도심 로스터리 연합',
      region: '제주시 일도이동',
      quantityEstimate: '일 30kg 내외',
      frequency: '상시',
      status: 'active',
    },
    {
      id: 402,
      sourceName: '중문 관광단지 카페',
      region: '서귀포시 중문동',
      quantityEstimate: '일 50kg 내외',
      frequency: '상시',
      status: 'active',
    },
  ],
}

export const ideasBySpecies: Record<string, UseIdea[]> = {
  'JJU-AGR-001': [
    {
      id: 1001,
      title: '감귤박 효소 발효 퇴비',
      body: '감귤박을 미강·당밀과 함께 발효시키면 토양 미생물 활성을 높이는 친환경 퇴비가 된다. 산도 조절에 주의.',
      contributor: { displayName: '흙살림지기', bio: '제주 토착 미생물 연구' },
      createdAt: '2026-05-12T09:00:00+09:00',
    },
    {
      id: 1002,
      title: '천연 펙틴 추출 잼 베이스',
      body: '감귤박에서 펙틴을 추출해 잼·젤리의 천연 응고제로 사용. 가공식품 첨가물 대체 가능성.',
      contributor: { displayName: '귤꽃공방' },
      createdAt: '2026-04-28T14:30:00+09:00',
    },
  ],
  'JJU-MAR-001': [
    {
      id: 2001,
      title: '패각 분말 토양개량제',
      body: '굴 껍데기를 세척·분쇄해 산성 토양의 pH를 높이는 개량제로 활용. 석회 비료를 일부 대체할 수 있다.',
      contributor: { displayName: '바다농부', bio: '해양 부산물 순환 실험' },
      createdAt: '2026-05-03T11:20:00+09:00',
    },
  ],
  'JJU-PRO-001': [
    {
      id: 3001,
      title: '맥주박 그래놀라 바',
      body: '건조·분쇄한 맥주박을 오트밀과 섞어 식이섬유가 풍부한 업사이클 스낵으로. 단맛은 감귤 착즙박과 조합.',
      contributor: { displayName: '제로웨이스트키친' },
      createdAt: '2026-05-20T16:05:00+09:00',
    },
  ],
  'JJU-LIF-001': [
    {
      id: 4001,
      title: '커피박 탈취 사쉐',
      body: '건조한 커피박을 부직포 주머니에 담아 냉장고·신발장 탈취제로. 가장 손쉬운 재활용 입문.',
      contributor: { displayName: '동네리필상점' },
      createdAt: '2026-05-18T10:10:00+09:00',
    },
    {
      id: 4002,
      title: '커피박 고형연료(펠릿)',
      body: '커피박을 압축 성형해 발열량 높은 바이오 펠릿으로 제조. 수분 관리와 성형 압력이 품질을 좌우한다.',
      contributor: { displayName: '순환에너지랩', bio: '바이오매스 연료화' },
      createdAt: '2026-05-25T13:40:00+09:00',
    },
  ],
}

export function getAllSpecies(): Species[] {
  return species
}

export function getSpeciesByCode(code: string): Species | undefined {
  return species.find((s) => s.code === code)
}

export function getSourcesByCode(code: string): SourcePublic[] {
  return sourcesBySpecies[code] ?? []
}

export function getIdeasByCode(code: string): UseIdea[] {
  return ideasBySpecies[code] ?? []
}
