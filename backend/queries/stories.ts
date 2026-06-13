import { supabasePublic } from '@/backend/supabase'
import type { Story } from '@/backend/types'

function toStory(row: {
  id: number
  title: string
  summary: string | null
  body: string
  cover_image_url: string | null
  match_id: number | null
  published: boolean
  published_at: string | null
  created_at: string
}): Story {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    matchId: row.match_id,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  }
}

/** 발행된 이력 목록 (최신순) */
export async function getStories(): Promise<Story[]> {
  const { data, error } = await supabasePublic
    .from('stories')
    .select('id, title, summary, body, cover_image_url, match_id, published, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('getStories error:', error.message)
    return []
  }

  return (data ?? []).map(toStory)
}

/** 이력 단건 조회 */
export async function getStoryById(id: number): Promise<Story | null> {
  const { data, error } = await supabasePublic
    .from('stories')
    .select('id, title, summary, body, cover_image_url, match_id, published, published_at, created_at')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    console.error('getStoryById error:', error.message)
    return null
  }

  return toStory(data)
}
