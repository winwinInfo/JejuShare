
 Next.js(App Router) + Supabase

## 핵심 원칙

Next.js는 한 파일에 데이터 패칭(백엔드)과 UI(프론트)가 섞이기 쉽다.
그래서 **레포는 하나지만, 폴더로 `frontend/` · `backend/` 영역을 나눈다.**
경계(계약)는 단 하나 — **`backend/types.ts`의 타입**이다.


## 폴더 구조

```
repo/
├── app/                    # Next.js 라우팅 = "조립" 레이어 (얇게 유지)
│   ├── page.tsx            #   backend에서 데이터 받아 frontend 컴포넌트에 넘김
│   ├── register/page.tsx
│   └── layout.tsx
│
├── backend/                #  백엔드 작업자 영역
│   ├── supabase.ts         #   Supabase 클라이언트
│   ├── types.ts            #   데이터 모델 = 두 영역의 "계약서"
│   └── queries/            #   데이터 접근 / 비즈니스 로직
│       └── items.ts        #   getItems(), createItem() ...
│
├── frontend/               #   프론트엔드 작업자 영역 (순수 UI)
│   ├── components/         #   props만 받아 렌더하는 컴포넌트
│   │   └── ItemCard.tsx
│   ├── hooks/              #   클라이언트 훅
│   └── styles/             #   globals.css 등
│
└── public/                 # 정적 파일
```

> 현재 `lib/` 폴더는 위 계획에서 `backend/`로 옮겨질 자리다.
> (이 문서는 구조/규칙만 정의하며, 실제 파일 이동은 별도 작업으로 진행한다.)

## 영역별 소유권

| 폴더 | 주 담당 | 역할 |
|------|---------|------|
| `backend/` | 백엔드 | Supabase 쿼리, 비즈니스 로직, 데이터 타입 |
| `frontend/` | 프론트 | 컴포넌트, 훅, 스타일 — 순수 UI |
| `app/` | 함께 | 라우팅 + 조립. 얇게 유지, 로직 넣지 않기 |
| `backend/types.ts` | 함께 (협의) | 데이터 계약서. 바꿀 땐 서로 알리기 |

## 경계 규칙

1. **`frontend/`는 `backend/supabase`를 절대 import 하지 않는다.**
   오직 `backend/types.ts`의 타입만 안다.
2. **`backend/`는 React 컴포넌트를 import 하지 않는다.** UI를 모른다.
3. **데이터를 가져오거나 저장하는 모든 코드는 `backend/queries/`에 둔다.**
   `app/`이나 컴포넌트 안에서 직접 Supabase를 호출하지 않는다.
4. **컴포넌트는 데이터를 props로만 받는다.** 자기가 패칭하지 않는다.

이 규칙만 지키면 작업 파일이 안 겹쳐서 머지 충돌이 거의 없다.
프론트는 더미 데이터로 `frontend/`만 보며 작업할 수 있다.

## import 경로

```ts
import { getItems } from '@/backend/queries/items'
import { Item }     from '@/backend/types'
import { ItemCard } from '@/frontend/components/ItemCard'
```

## 패턴 예시

**백엔드 — 데이터 함수 (`backend/queries/items.ts`)**
```ts
import { supabase } from '@/backend/supabase'
import { Item } from '@/backend/types'

export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, owners(*)')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data as Item[]
}
```

**프론트 — 순수 컴포넌트 (`frontend/components/ItemCard.tsx`)**
```tsx
import { Item } from '@/backend/types'   // 타입만 import

export function ItemCard({ item }: { item: Item }) {
  return ( /* item 데이터를 렌더 — Supabase 모름 */ )
}
```

**조립 — 라우트 (`app/page.tsx`)**
```tsx
import { getItems } from '@/backend/queries/items'
import { ItemCard } from '@/frontend/components/ItemCard'

export default async function Home() {
  const items = await getItems()
  return <>{items.map((i) => <ItemCard key={i.id} item={i} />)}</>
}
```
