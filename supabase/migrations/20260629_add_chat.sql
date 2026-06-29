-- =====================================================================
-- 1:1 채팅 (프로필 기반 DM)
-- =====================================================================
-- 두 사용자당 대화방 1개. 메시지는 Postgres에 영속. 실시간 도착은 Realtime(WebSocket) 구독.
-- 보안: 대화 당사자 2명만 SELECT/INSERT. blocks 관계면 대화 시작/전송 금지.
--       연락처(phone/email) 공개 규칙은 기존대로 matches.accepted 에만 의존 — 채팅과 무관.
-- =====================================================================

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

-- ===== 권한 (Supabase 기본 grant) =====
grant all on table public.conversations to anon, authenticated, service_role;
grant all on table public.messages      to anon, authenticated, service_role;

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

-- ===== Realtime publication (멱등) =====
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
