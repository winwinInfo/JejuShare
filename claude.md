# "제주 새활용 도감" 프로젝트

## 프로젝트 배경

이 프로젝트는 **2026 제주생활실험 사업**에 선정된 "제주 업사이클링 원료 정보 인프라 실험"입니다. 5개월(6~10월) 동안 제주의 미활용 농수산 부산물 정보를 수집·기록·공개하고, 자원 보유자와 수요자를 잇는 공공 인프라를 구축합니다.

운영 주체: **주식회사 제주시트러스랩스** (감귤박 업사이클링 R&D 기업).

## 정체성

- **서비스명:** 제주 새활용 도감 (Jeju Upcycle Dogam)
- **부제:** "제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들."
- **톤:** 필드 노트·도감 톤. "나눔/공유 플랫폼" 같은 행정 톤 금지.
- **목표 도메인:** jejudogam.kr

## 벤치마킹 레퍼런스

1. **당근마켓** — 유저 게시글 피드 구조
2. **iNaturalist (inaturalist.org)** — 기여자 프로필, 발견 단위 카드
3. **Cooper Hewitt Collection** — 차분한 카탈로그 톤

## 인증 시스템

- **방식:** 카카오 소셜 로그인. **Supabase Auth 사용.**
- 비밀번호 로그인 금지. 매직링크는 백엔드에 유지하되 UI 미노출.
- 가입 시 입력: 닉네임, **연락처(전화), 이용 약관 동의** (카카오에서 이메일 자동 수집)

## 사용자 모델

역할 구분 없음. **모든 사용자는 보유자·수요자가 동시에 될 수 있음.**

권한 구분: 일반 사용자 vs admin (1명).

## 데이터 모델 (5개 테이블)

### 1. user
- id (PK, Supabase auth.users 연동)
- email (unique, **비공개** — 본인과 admin만)
- nickname (닉네임, 공개)
- phone (**기본 비공개**, 매칭 수락 시 상대에게만 공개)
- bio (한 줄 소개, optional)
- terms_agreed_at (약관 동의 시각)
- created_at

### 2. posts (게시글) — 핵심
- id (PK)
- author_id (user FK)
- post_type (enum: 'offer' | 'request') — 있어요 / 구해요
- title (필수)
- body (필수)
- region (필수, 공개 — 읍/면/동 수준)
- image_url (선택)
- status (enum: 'active' | 'closed')
- created_at, updated_at

### 3. matches (매칭) — 핵심
- id (PK)
- initiator_id (user FK) — 관심을 표명한 사람
- post_id (posts FK) — 대상 게시글
- post_author_id (user FK) — 게시글 작성자 (자동 계산)
- message (initiator의 첫 메시지)
- status (enum):
  - `interested` — 관심 표명 직후
  - `accepted` — 게시글 작성자 수락. **이 순간 양쪽 연락처가 서로에게 공개됨**
  - `declined` — 거절
  - `completed` — 거래 성사
  - `failed` — 거래 무산
- contact_revealed_at (수락 시각, 연락처 공개 시점 기록)
- status_history (jsonb)
- created_at, updated_at

### 4. reports (신고)
- id (PK)
- reporter_id (user FK)
- target_user_id (user FK)
- match_id (FK, nullable)
- reason (text)
- status (pending/reviewed/resolved)
- created_at

### 5. blocks (차단)
- id (PK)
- blocker_id (user FK)
- blocked_id (user FK)
- created_at
- (unique: blocker_id + blocked_id)

### 6. conversations / messages (채팅 — 1:1 DM)
- **conversations**: id (PK), user_a/user_b (user FK, `user_a < user_b` 정렬로 쌍당 1개), last_message_at, created_at. (unique: user_a + user_b)
- **messages**: id (PK), conversation_id (FK), sender_id (user FK), body, read_at(nullable), created_at.
- 메시지는 Postgres에 영속, 실시간 도착은 **Supabase Realtime(WebSocket)** 구독. 별도 웹소켓 서버 없음.

## 매칭 흐름 (핵심 명세)

### 단계별 흐름

1. **게시글 상세 페이지에서 "관심 있어요" 클릭**
   - 메시지 입력 모달 → matches에 `interested` row 생성
   - 게시글 작성자에게 알림 + 마이페이지 알림 표시
   - 이 시점에서 양쪽은 서로의 **닉네임·한 줄 소개·누적 활동 통계만** 봄

2. **게시글 작성자가 마이페이지에서 매칭 검토**
   - 표시 정보: 닉네임, 한 줄 소개, 가입일, 누적 활동(등록 게시글 N, 성사 매칭 N, 신고 누적 여부)
   - 첨부된 메시지 확인

3. **"수락" 클릭 시 확인 모달**
   - 모달 문구: "수락하시면 [상대 닉네임]님께 귀하의 연락처(전화: 010-xxxx-xxxx, 이메일: xxx@xxx.com)가 즉시 공개됩니다. 진행하시겠습니까?"
   - 확인 시 status `accepted`, contact_revealed_at 기록
   - **이 순간부터 양쪽이 서로의 phone, email을 마이페이지의 해당 매칭 카드에서 볼 수 있음**

4. **거절 시** status `declined`, initiator에게 알림 (메시지 없이 사실만)

5. **거래 진행 후 결과 표시** (양쪽 누구든 가능)
   - "거래 성사" → status `completed`
   - "거래 무산" → status `failed`

### 공개 가시성 규칙

- 게시글 목록/상세: 작성자 닉네임·지역·제목·본문 공개. 매칭 진행 건수(숫자만) 표시.
- **누가 관심을 표명했는지는 본인과 게시글 작성자만 본다.** 외부에는 숫자만.
- 마이페이지 매칭 카드에 상대 닉네임 표시. 수락 후에는 연락처도 같은 카드에서 표시.

## 핵심 보안 원칙

1. **연락처(phone, email)는 매칭 `accepted` 상태가 아닌 한 절대 노출 금지.**
2. RLS 정책으로 row 단위 분리:
   - user.phone, user.email → 본인 + admin + accepted 매칭의 상대만 SELECT 가능
3. 차단(blocks) 관계인 사용자끼리는 서로의 매칭 신청 자체가 불가능.
4. 신고 3건 누적 시 admin 검토 대기열 자동 진입.

## 채팅 (1:1 DM)

- **목적:** 프로필/게시글에서 작성자에게 바로 말을 거는 1:1 실시간 대화. 매칭 이력 불필요(아무 사용자에게나 가능).
- **진입:** 게시글 상세의 "대화하기" → `get_or_create_conversation` RPC로 대화방 생성/조회 후 `/chat/[id]` 이동. 대화 목록은 `/chat`.
- **보안:**
  - 대화 당사자 2명만 conversations/messages 를 SELECT/INSERT (RLS).
  - **차단(blocks) 관계면 대화 시작·전송 모두 불가** (RPC와 messages_insert 정책 양쪽에서 차단).
  - **채팅은 대화만 한다. 연락처(phone/email) 공개 규칙은 기존대로 매칭 `accepted` 에만 의존 — 채팅이 생겨도 연락처 노출 규칙은 안 바뀐다.**
- **보관기간(TODO):** 채팅 로그도 개인정보. 명시적 보관기간 정책(예: 마지막 메시지 후 1년 자동 삭제, `pg_cron`) 도입 필요 + 이용약관 반영. 현재는 무기한 보존.

## 메인 페이지 피드

카드 1장:
- 대표 이미지 (있을 경우)
- post_type 뱃지 (있어요 / 구해요)
- 제목
- 지역
- 작성자 닉네임 · 작성일

레이아웃: 모바일 1열, 태블릿 2열, 데스크톱 3열. Hover 부상.

## 톤·디자인

- 배경: 베이지·아이보리 계열
- 텍스트: 무채색
- 폰트: Pretendard
- 필드 노트 결합

## 이용 약관 필수 포함 사항

- "매칭 수락 시 양측의 전화번호·이메일이 상대방에게 자동 공개됨"
- "이용자가 등록한 게시글 정보는 사업 종료 후 공공 목적의 자료로 활용·공개될 수 있음"
- "이용자의 개인 식별 정보(연락처·이메일·매칭 이력)는 운영 주체인 주식회사 제주시트러스랩스가 별도 보관·관리하며, 공공 결과물 이관 대상에 포함되지 않음"
- "부적절한 매칭 행위 발생 시 신고 가능하며, 누적 신고 시 이용 제한될 수 있음"
- "이용자 간 채팅(1:1 대화) 내용은 서비스 제공을 위해 저장되며, 보관기간 정책에 따라 일정 기간 후 삭제될 수 있음"

## 절대 하지 말 것

1. 매칭 `accepted` 이전에 연락처 노출 금지
2. "나눔/공유 플랫폼" 같은 행정 카피 금지
3. 지도 시각화 금지
4. 결제 기능 금지
5. 비밀번호 로그인 금지
6. 외부 페이지에 매칭 당사자 신원 노출 금지 (숫자만)

## 기술 스택

- Next.js + TypeScript + Vercel
- 인증·DB: **Supabase (Auth + Postgres + RLS)**
- 실시간 채팅: **Supabase Realtime** (별도 웹소켓 서버 없음)
- 스타일: Tailwind + shadcn/ui
- 이메일 발송 (매칭 알림): Resend 또는 Supabase 기본
- DB 스키마 관리: **코드(SQL) 기반** — `supabase/migrations/` + `supabase/scripts/run-sql.mjs` (대시보드 직접 수정 금지). 자세한 건 `supabase/README.md`.

## 성능 규칙 (페이지 렌더링 속도가 중요)

이 서비스는 Vercel(서버리스) → Supabase 구조라 **요청당 비용의 대부분이 DB 왕복(RTT)**이다. 쿼리 실행 자체보다 **왕복 횟수**가 체감 속도를 좌우한다. 페이지 렌더링 성능은 1차 품질 기준으로 다룬다.

1. **독립적인 쿼리는 반드시 병렬로 실행한다.** 서로의 결과에 의존하지 않는 read 가 2개 이상이면 순차 `await` 로 쌓지 말고 `Promise.all` 로 묶는다. 순차는 `t1+t2+t3`, 병렬은 `max(t1,t2,t3)` — RTT 지배 환경에서 직결되는 차이다.
   - 단, 뒤 쿼리가 앞 결과를 필요로 하면(의존) 당연히 순차로 둔다.
   - 부분 실패를 살려야 하면 `Promise.allSettled` 를 쓴다.
2. **고정된 소수의 독립 쿼리 → `Promise.all`. 여러 단계 + short-circuit/조건 분기가 필요하거나 왕복을 1회로 줄여야 하면 → RPC(plpgsql) 한 함수로 합친다.** RPC 는 요청·커넥션이 1개이고 분기/단축평가를 DB 안에서 처리하므로 `Promise.all`(요청 N개)보다도 낫다. 기존 `find_conversation`, `header_state` 가 이 패턴.
3. **목록/상세 쿼리에는 `limit` 을 건다.** 무제한 `select` 로 행 전체를 끌어오지 않는다(메시지·게시글 등). 페이지네이션을 전제로 작성.
4. **신원 검증은 네트워크 왕복을 피한다.** 페이지 렌더에서 사용자 식별은 `getClaims()`(로컬 JWT 검증)를 쓰고, 폐기 토큰까지 잡는 네트워크 검증은 실제 쓰기를 하는 서버 액션 + RLS 에 맡긴다.
5. 새 페이지(데이터를 읽는 라우트)에는 레이아웃에 맞춘 `loading.tsx` 스켈레톤을 둔다. (체감 개선용 — 실제 지연 단축과는 별개)

## 푸터 필수 문구

"운영: 주식회사 제주시트러스랩스 · 본 프로젝트는 2026 제주생활실험 사업의 일환으로 진행됩니다."
