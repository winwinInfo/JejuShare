import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 크롤러 규칙 + 사이트맵 위치 안내.
// 개인화/인증 경로는 색인에서 제외한다(검색 노출 가치도 없고 로그인 필요).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/my", "/login", "/register", "/auth/", "/posts/new"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
