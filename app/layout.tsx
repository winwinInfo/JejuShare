import type { Metadata } from "next";
import "@/frontend/styles/globals.css";
import { SiteHeader } from "@/frontend/components/SiteHeader";
import { SiteFooter } from "@/frontend/components/SiteFooter";

export const metadata: Metadata = {
  title: "제주 새활용 도감",
  description:
    "제주의 버려지는 자원을 함께 발견하고, 기록하고, 다시 쓰는 사람들. 제주 미활용 농수산 부산물 정보 도감.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
