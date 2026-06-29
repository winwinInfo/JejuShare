import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/backend/queries/posts";
import { stories } from "@/content/stories/index";

// 검색엔진이 크롤링할 공개 URL 목록.
// 로그인/마이페이지/작성·수정 화면 등 비공개 경로는 의도적으로 제외한다.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/dogam`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/history`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const storyRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${SITE_URL}/history/${s.slug}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const posts = await getPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/posts/${p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...storyRoutes, ...postRoutes];
}
