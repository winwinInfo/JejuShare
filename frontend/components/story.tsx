/**
 * 새활용 늬우스 글 작성용 공유 컴포넌트 셋.
 *
 * 사용 예시:
 *   import { Lead, H2, P, Figure, Callout, Divider, TwoCol } from '@/frontend/components/story'
 */

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { StoryMeta } from '@/content/stories/index'

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function StoryLayout({
  meta,
  children,
}: {
  meta: StoryMeta
  children: ReactNode
}) {
  const date = new Date(meta.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/?tab=news"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← 새활용 늬우스로
      </Link>

      {meta.coverImage && (
        <img
          src={meta.coverImage}
          alt={meta.title}
          className="mt-6 w-full rounded-lg object-cover max-h-80"
        />
      )}

      <header className="mt-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold leading-snug tracking-tight">
          {meta.title}
        </h1>
        {meta.summary && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {meta.summary}
          </p>
        )}
        <time
          className="mt-3 block text-xs text-muted-foreground tabular-nums"
          dateTime={meta.publishedAt}
        >
          {date}
        </time>
      </header>

      <article className="mt-8 space-y-0">{children}</article>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/** 글의 도입부 — 본문보다 크고 여유로운 톤 */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-0 text-lg leading-relaxed text-muted-foreground font-light">
      {children}
    </p>
  )
}

/** 일반 본문 단락 */
export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-base leading-[1.85] text-foreground/90">
      {children}
    </p>
  )
}

/** 섹션 제목 */
export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 mb-4 text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  )
}

/** 소제목 */
export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 mb-3 text-base font-semibold text-foreground">
      {children}
    </h3>
  )
}

/** 강조 인용 / 주목 문구 */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-2 border-foreground/30 pl-5 text-base italic leading-relaxed text-muted-foreground">
      {children}
    </blockquote>
  )
}

/** 섹션 구분선 */
export function Divider() {
  return <hr className="my-10 border-border" />
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

/** 이미지 + 선택적 캡션 */
export function Figure({
  src,
  alt,
  caption,
  priority,
}: {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg object-cover"
        loading={priority ? 'eager' : 'lazy'}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** 이미지 2장 나란히 */
export function TwoCol({
  left,
  right,
}: {
  left: { src: string; alt: string; caption?: string }
  right: { src: string; alt: string; caption?: string }
}) {
  return (
    <div className="my-8 grid grid-cols-2 gap-3">
      {[left, right].map((img) => (
        <figure key={img.src}>
          <img
            src={img.src}
            alt={img.alt}
            className="w-full rounded-lg object-cover aspect-[4/3]"
            loading="lazy"
          />
          {img.caption && (
            <figcaption className="mt-1.5 text-center text-xs text-muted-foreground">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
