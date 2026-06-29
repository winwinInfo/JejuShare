// 사이트 절대 URL의 단일 진실 공급원.
// OG 이미지·사이트맵·robots·RSS가 모두 같은 도메인을 쓰도록 한 곳에서 결정한다.

// 프로덕션 공개 도메인(이미지·페이지가 실제로 서빙되는 곳).
const PRODUCTION_URL = "https://www.jeju-upcycle-dogam.kr";

// 우선순위: 직접 지정(NEXT_PUBLIC_SITE_URL) > Vercel 프리뷰 배포의 고유 URL > 프로덕션 도메인
export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`;
  return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "제주 새활용 도감";
export const SITE_DESCRIPTION =
  "제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들. 농수산 부산물부터 카페 커피박·인쇄소 파지까지, 제주 미활용 자원 정보 도감.";
