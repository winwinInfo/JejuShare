# 채팅 기능 구현 — 세션 인수인계 문서

> 이 문서는 이전 Claude 세션에서 논의·결정한 내용을 다음 세션이 이어받기 위한 핸드오프입니다.
> 작성: 2026-06-29

## 0. 가장 먼저 — 환경 세팅 이슈

- 이전 세션은 **`D:\projects\jejushare`(상위 폴더)** 에서 켜져서, 실제 프로젝트인
  **`D:\projects\jejushare\JejuShare`** 의 `.mcp.json`을 못 읽었음 → Supabase MCP가 `/mcp`에 안 떴음.
- **해결: 반드시 `JejuShare` 폴더 안에서 `claude`를 실행할 것.** 그러면 MCP 승인 프롬프트가 뜨고,
  `/mcp`에서 supabase 인증(OAuth) 후 MCP로 직접 마이그레이션 적용 가능.
- Supabase project_ref: `qotyklxakmqfehgvsouq`

## 1. 무엇을 만드는가

**프로필 기반 1:1 실시간 채팅(DM).** 프로필에서 "프로필 보기 / 대화하기" → 채팅창 이동 → 실시간 대화.

### 핵심 결정 사항
- **별도 웹소켓 서버 만들지 않음.** Next.js+Vercel+Supabase 스택이므로 **Supabase Realtime**
  (내부적으로 WebSocket) 사용. Vercel 서버리스 제약과 무관하고 기존 Auth/RLS 재사용 가능.
- **아무 사용자에게나** 대화 걸 수 있음 (매칭 이력 불필요). 단 `blocks` 관계면 금지.
- **보안 분리:** 채팅은 대화만. **연락처(phone/email) 공개는 기존대로 `matches.accepted`에만 의존.**
  채팅이 생겨도 연락처 노출 규칙은 안 바뀜.
- 메시지는 Postgres `messages` 테이블에 영속 → 재접속/새로고침해도 보존, 실시간 도착만 구독.
- 소규모 파일럿 규모(제주 5개월)엔 무료 티어(동시 200, 월 200만 메시지)로 충분.

### 보관기간 관련 (사용자 질문에서 나온 것)
- 안 건드리면 무기한 보존. 단 채팅 로그도 개인정보 → **명시적 보관기간 정책 권장**
  (예: 마지막 메시지 후 1년 후 자동 삭제, `pg_cron`). 이용약관에도 명시 필요. (TODO, 추후)
- 무료 티어는 7일 무활동 시 pause(데이터는 보존, 복구 가능). 장기 방치 시에만 삭제 위험.

## 2. 실제 DB 스키마 (database.types.ts 기준, 중요)

- 사용자 테이블명은 **`"user"`** (예약어라 따옴표 필요), `id`는 uuid.
- 이미 존재: `user`, `posts`, `matches`, `blocks`, `likes`, `reports`, `email_contacts`.
- `blocks` 테이블: `blocker_id`, `blocked_id` (차단 검사에 재사용).
- **이 프로젝트는 그동안 마이그레이션 파일로 스키마 관리 안 함.** 전부 대시보드에서 직접 생성.
  `migrations/`엔 파일 1개(`20260615_add_posts_amount_timing.sql`)만 있음.
- 따라서 `supabase db push`를 무심코 돌리면 상태 어긋남 위험.
  → **새 마이그레이션은 파일로 남기되, 적용은 MCP/대시보드로 콕 집어서.**
- 권장(선택): 먼저 `supabase db pull`로 현재 원격 스키마를 baseline 마이그레이션으로 떠두면
  앞으로 코드 기반 관리로 전환됨. (사용자가 baseline 먼저 할지 채팅 먼저 할지 아직 미결정.)

## 3. 작업 계획 (태스크)

1. **채팅 DB 마이그레이션 작성** — conversations/messages 테이블 + RLS + RPC + 트리거 + realtime publication.
   → 아래 SQL 이미 작성 완료(섹션 5). 파일 경로: `supabase/migrations/20260629_add_chat.sql`.
   (이전 세션에서 이 파일 Write가 사용자 인터럽트로 실제 저장은 안 됨 — 다음 세션이 저장 후 적용할 것.)
2. **database.types.ts에 chat 타입 추가** — conversations/messages Row/Insert/Update/Relationships +
   `get_or_create_conversation` 함수 타입. (또는 MCP/CLI로 `supabase gen types`로 재생성.)
3. **Realtime 훅 작성** — `frontend/lib/useChat.ts`: 초기 메시지 로드 + postgres_changes 구독 + 전송 + 읽음처리.
4. **채팅 UI** — `app/chat/page.tsx`(대화 목록, last_message_at 정렬) + `app/chat/[id]/page.tsx`(채팅창).
   프로필 컴포넌트에 "대화하기" 버튼(→ `get_or_create_conversation` RPC 호출 후 `/chat/[id]` 이동).
5. **claude.md 명세 갱신** — "절대 하지 말 것 4. 결제·실시간 채팅 금지"에서 채팅 부분 제거 +
   채팅 명세 + 보관기간 정책 추가. (사용자가 "명세를 바꾸겠다"고 명시적으로 동의함.)

## 4. 클라이언트 구현 메모

- 브라우저 클라: `frontend/lib/supabase-browser.ts`의 `getSupabaseBrowser()` 사용.
- 서버: `backend/supabase.ts`의 `createSupabaseServer()`.
- 대화 시작: `supabase.rpc('get_or_create_conversation', { other_id })` → conv id 받아 라우팅.
- 구독 예:
  ```ts
  supabase.channel(`conv:${id}`)
    .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages',
          filter: `conversation_id=eq.${id}` },
        (payload) => append(payload.new))
    .subscribe()
  ```
- UI 기존 패턴 확인할 것: `app/posts/[id]`, `app/my` 등에서 shadcn/ui·Tailwind 사용법, 인증 유저 가져오는 방식.

## 5. 작성 완료된 마이그레이션 SQL (이대로 저장 후 적용)

`supabase/migrations/20260629_add_chat.sql`:

```sql
-- 1:1 채팅 (프로필 기반 DM)
-- 두 사용자당 대화방 1개. 메시지는 Postgres에 영속. 실시간 도착은 Realtime(WebSocket) 구독.
-- 보안: 대화 당사자 2명만 SELECT/INSERT. blocks 관계면 대화/전송 금지.
--       연락처(phone/email) 공개 규칙은 기존대로 matches.accepted에만 의존 — 채팅과 무관.

-- ===== 테이블 =====
create table if not exists public.conversations (
  id              bigint generated always as identity primary key,
  user_a          uuid not null references public."user"(id) on delete cascade,
  user_b          uuid not null references public."user"(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  constraint conversations_user_order  check (user_a < user_b),
  constraint conversations_unique_pair unique (user_a, user_b)
);

create table if not exists public.messages (
  id              bigint generated always as identity primary key,
  conversation_id bigint not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public."user"(id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 4000),
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

create index if not exists messages_conv_created_idx on public.messages (conversation_id, created_at);
create index if not exists conversations_user_a_idx on public.conversations (user_a);
create index if not exists conversations_user_b_idx on public.conversations (user_b);

-- ===== 헬퍼 함수 =====
create or replace function public.is_conversation_participant(conv_id bigint)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.conversations c
    where c.id = conv_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
  );
$$;

create or replace function public.other_participant(conv_id bigint)
returns uuid language sql stable security definer set search_path = public as $$
  select case when c.user_a = auth.uid() then c.user_b else c.user_a end
  from public.conversations c where c.id = conv_id;
$$;

-- ===== RLS =====
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations
  for select to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select to authenticated
  using (public.is_conversation_participant(conversation_id));

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_conversation_participant(conversation_id)
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = public.other_participant(conversation_id))
         or (b.blocker_id = public.other_participant(conversation_id) and b.blocked_id = auth.uid())
    )
  );

drop policy if exists messages_update_read on public.messages;
create policy messages_update_read on public.messages
  for update to authenticated
  using (public.is_conversation_participant(conversation_id))
  with check (public.is_conversation_participant(conversation_id));

-- ===== 대화방 생성/조회 RPC =====
create or replace function public.get_or_create_conversation(other_id uuid)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  a uuid; b uuid; conv_id bigint;
begin
  if me is null then raise exception 'not authenticated'; end if;
  if other_id = me then raise exception 'cannot start conversation with self'; end if;
  if exists (
    select 1 from public.blocks
    where (blocker_id = me and blocked_id = other_id)
       or (blocker_id = other_id and blocked_id = me)
  ) then raise exception 'blocked'; end if;

  if me < other_id then a := me; b := other_id; else a := other_id; b := me; end if;

  select id into conv_id from public.conversations where user_a = a and user_b = b;
  if conv_id is null then
    insert into public.conversations (user_a, user_b) values (a, b) returning id into conv_id;
  end if;
  return conv_id;
end;
$$;

grant execute on function public.get_or_create_conversation(uuid) to authenticated;

-- ===== last_message_at 갱신 트리거 =====
create or replace function public.bump_conversation_last_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_conversation on public.messages;
create trigger messages_bump_conversation
  after insert on public.messages
  for each row execute function public.bump_conversation_last_message();

-- ===== Realtime publication =====
alter publication supabase_realtime add table public.messages;
```

## 6. 다음 세션이 할 일 순서

1. (JejuShare 폴더에서 켜고) `/mcp`로 supabase 인증.
2. (선택) baseline 할지 사용자에게 확인 → 하면 `supabase db pull`.
3. 위 SQL을 `supabase/migrations/20260629_add_chat.sql`로 저장.
4. MCP로 마이그레이션 적용(apply_migration). 적용 후 RLS·RPC 동작 점검.
5. database.types.ts 갱신(또는 gen types).
6. useChat 훅 → 채팅 UI → 프로필 "대화하기" 버튼.
7. claude.md 명세 갱신.
8. (추후) 보관기간 자동삭제 pg_cron + 이용약관 문구.
```
