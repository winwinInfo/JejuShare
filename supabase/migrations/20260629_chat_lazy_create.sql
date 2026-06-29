-- =====================================================================
-- 채팅: 빈 대화방 생성 방지 (lazy create)
-- =====================================================================
-- "대화하기" 클릭만으로는 conversations row 를 만들지 않는다.
-- 첫 메시지를 실제로 보낼 때 대화방+메시지를 원자적으로 생성한다.
--   - find_conversation(other_id)      : 기존 대화방 id 조회. 없으면 null. blocks면 예외.
--   - send_first_message(other_id,body): 첫 전송 시점에 대화방(없으면 생성)+메시지 삽입 후 id 반환.
-- 기존 get_or_create_conversation 은 빈 방을 만들어 더 이상 사용하지 않음 → 제거.
-- =====================================================================

drop function if exists public.get_or_create_conversation(uuid);

create or replace function public.find_conversation(other_id uuid)
returns bigint language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); a uuid; b uuid; conv_id bigint;
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
  return conv_id; -- 없으면 null
end;
$$;

grant execute on function public.find_conversation(uuid) to authenticated;

create or replace function public.send_first_message(other_id uuid, body text)
returns bigint language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); a uuid; b uuid; conv_id bigint; text_body text := btrim(body);
begin
  if me is null then raise exception 'not authenticated'; end if;
  if other_id = me then raise exception 'cannot start conversation with self'; end if;
  if char_length(text_body) = 0 then raise exception 'empty message'; end if;
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
  insert into public.messages (conversation_id, sender_id, body) values (conv_id, me, text_body);
  return conv_id;
end;
$$;

grant execute on function public.send_first_message(uuid, text) to authenticated;
