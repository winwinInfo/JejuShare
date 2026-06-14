-- posts 테이블에 양/시기 컬럼 추가
--  amount: 발생하는 양(있어요) / 필요한 양(구해요)  예) "주 2톤", "200kg", "100장"
--  timing: 발생 시기(있어요) / 필요한 시기(구해요)  예) "11월~2월", "상시", "8월 중"
-- 둘 다 자유 텍스트, 선택 입력(nullable).
alter table public.posts
  add column if not exists amount text,
  add column if not exists timing text;
