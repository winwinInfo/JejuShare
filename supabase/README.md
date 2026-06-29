# Supabase — 코드(SQL) 기반 스키마 관리

이 프로젝트의 DB 스키마는 **대시보드가 아니라 이 디렉터리의 SQL 마이그레이션으로 관리**합니다.
(이전에는 대시보드에서 직접 만들었고, 현재 상태를 `migrations/00000000000000_remote_baseline.sql`
baseline 으로 떠 두었습니다.)

- project_ref: `qotyklxakmqfehgvsouq`
- 인증: 루트 `.env.local` 의 `PAT=<sbp_...>` (Supabase personal access token).
  스크립트가 자동으로 읽음. `.env.local` 은 git에 커밋되지 않음.

## 디렉터리

```
supabase/
  migrations/
    00000000000000_remote_baseline.sql   # 원격 전체 스키마 baseline (2026-06-29 시점)
    20260615_add_posts_amount_timing.sql # 기존 마이그레이션 (baseline에 이미 반영됨)
    <YYYYMMDD>_<설명>.sql                 # 앞으로 추가할 변경
  scripts/
    run-sql.mjs      # SQL 파일/인라인을 원격에 적용
    pull-schema.mjs  # 원격 현재 상태를 JSON 스냅샷으로 떠 drift 점검
```

## 스키마 변경 워크플로

1. `supabase/migrations/` 에 새 파일 추가: `YYYYMMDD_무엇.sql`
   - 멱등(idempotent)하게 작성 권장: `create table if not exists`, `create or replace`,
     `drop policy if exists` → `create policy`, enum 추가는 `do $$ ... if not exists`.
2. 적용:
   ```bash
   node supabase/scripts/run-sql.mjs supabase/migrations/20260629_add_chat.sql
   ```
   빠른 단발 실행은 `-e`:
   ```bash
   node supabase/scripts/run-sql.mjs -e "select count(*) from public.posts;"
   ```
3. TypeScript 타입 재생성 (`backend/database.types.ts`):
   - Supabase 대시보드 또는 `supabase gen types` 사용.
   - 토큰만으로 CLI 사용 시: `npx supabase gen types typescript --project-id qotyklxakmqfehgvsouq`
     (환경에 `SUPABASE_ACCESS_TOKEN` 필요)
4. drift 점검(선택): `node supabase/scripts/pull-schema.mjs` 로 스냅샷을 떠
   baseline/마이그레이션과 어긋난 부분이 없는지 확인.

## 원칙

- **대시보드에서 스키마를 직접 바꾸지 말 것.** 바꿔야 했다면 즉시 동일 내용을 마이그레이션 파일로 남길 것.
- baseline 은 다시 만들지 말고, 변경은 항상 새 마이그레이션으로 누적.
- 연락처(`user.phone`, `user.email`) 노출 규칙 등 RLS 변경은 특히 신중히 — 보안 정책은 `claude.md` 참고.
