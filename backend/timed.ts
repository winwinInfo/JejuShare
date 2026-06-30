/**
 * 서버 컴포넌트/쿼리의 구간 소요시간을 Vercel 함수 로그(stdout)로 찍는 계측 헬퍼.
 *
 * 목적: 페이지 렌더 1.x초가 "어느 구간"에서 쓰였는지 분해해서,
 *       병목이 쿼리(인덱스)냐 / 네트워크 왕복(리전 거리)이냐 / 콜드 스타트냐를 가른다.
 *
 * 읽는 법(Vercel → Logs):
 *   [timing] getConversations.convs: 230ms      ← DB 왕복 1회
 *   [timing] getConversations.profiles+msgs: 250ms
 *   [timing] chat.page.total: 1160ms            ← 합과 total 차이가 크면 그 차이가 콜드 스타트/프레임워크 오버헤드
 *
 * 같은 구간들이 다 같이 ~230ms면 → 리전 왕복(네트워크), 특정 구간만 크면 → 그 쿼리,
 * total 이 개별 합보다 훨씬 크면 → 콜드 스타트 등 쿼리 밖 비용.
 *
 * 디버깅용 임시 계측. 원인 확인 후 제거 가능.
 */
// fn 은 Promise 뿐 아니라 Supabase 쿼리 빌더(thenable=PromiseLike)도 받는다.
export async function timed<T>(label: string, fn: () => PromiseLike<T>): Promise<T> {
  const start = performance.now()
  try {
    return await fn()
  } finally {
    const ms = (performance.now() - start).toFixed(0)
    console.log(`[timing] ${label}: ${ms}ms`)
  }
}
