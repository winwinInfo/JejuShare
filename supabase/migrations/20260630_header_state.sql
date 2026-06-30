-- =====================================================================
-- 헤더 1회 조회용 RPC: nickname + 안읽은 메시지 수를 한 왕복에 반환
-- =====================================================================
-- SiteHeader 는 매 페이지 이동마다 (1) profile.nickname (2) unread count 를
-- 따로 쿼리했다. Vercel↔DB 왕복이 비용의 대부분이므로 두 조회를 RPC 하나로
-- 합쳐 DB 접근을 1회로 줄인다. user.id 는 쿠키 JWT 에서 로컬로 얻으므로
-- (getClaims) 별도 왕복이 아니다.
--
-- security definer: messages/conversations RLS 를 우회하므로, "내가 당사자인
-- 대화의, 상대가 보낸, 안 읽은" 조건을 함수 안에서 명시적으로 건다.
-- (기존 getUnreadMessageCount 는 messages_select RLS 에 의존했음 — 동일 의미)
-- =====================================================================

-- 안읽음 카운트 가속용 부분 인덱스: read_at is null 인 행만 색인.
create index if not exists messages_unread_idx
  on public.messages (conversation_id)
  where read_at is null;

create or replace function public.header_state()
returns table (nickname text, unread int)
language sql stable security definer set search_path = public as $$
  select
    (select u.nickname from public."user" u where u.id = auth.uid()),
    (select count(*)::int
       from public.messages m
       join public.conversations c on c.id = m.conversation_id
       where (c.user_a = auth.uid() or c.user_b = auth.uid())
         and m.sender_id <> auth.uid()
         and m.read_at is null);
$$;

grant execute on function public.header_state() to authenticated;
