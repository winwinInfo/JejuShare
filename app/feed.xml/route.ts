import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getPosts } from "@/backend/queries/posts";

// RSS 2.0 피드. 최신 게시글을 노출해 검색엔진/리더가 갱신을 감지하게 한다.
// 1시간 캐시(s-maxage) + stale-while-revalidate로 매 요청 DB 왕복을 피한다.
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPosts();

  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/posts/${p.id}`;
      const typeLabel = p.postType === "offer" ? "있어요" : "구해요";
      const title = `[${typeLabel}] ${p.title} (${p.region})`;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(p.body)}</description>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const lastBuildDate =
    posts.length > 0
      ? new Date(posts[0].createdAt).toUTCString()
      : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
