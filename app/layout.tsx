import type { Metadata } from "next";
import "@/frontend/styles/globals.css";
import { SiteHeader } from "@/frontend/components/SiteHeader";
import { SiteFooter } from "@/frontend/components/SiteFooter";

// OG 이미지 등 절대 URL의 기준이 되는 사이트 주소.
// 환경마다 실제로 도달 가능한 도메인을 써야 SNS 미리보기가 뜬다.
// 프로덕션 공개 도메인(이미지가 실제로 서빙되는 곳).
const PRODUCTION_URL = "https://www.jeju-upcycle-dogam.kr";

// 우선순위: 직접 지정(NEXT_PUBLIC_SITE_URL) > Vercel 프리뷰 배포의 고유 URL > 프로덕션 도메인
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, "")
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  return PRODUCTION_URL
}

const SITE_URL = resolveSiteUrl();
const SITE_NAME = "제주 새활용 도감";
const SITE_DESCRIPTION =
  "제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들. 농수산 부산물부터 카페 커피박·인쇄소 파지까지, 제주 미활용 자원 정보 도감.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
