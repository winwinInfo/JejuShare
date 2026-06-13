'use server'

import { createSupabaseServer } from '@/backend/supabase'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/backend/actions/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(
  postId: number,
  senderMessage: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: '로그인이 필요합니다.' }

  // 이미 이메일 보낸 이력 확인 (게시글당 1회 제한)
  const { data: existing } = await supabase
    .from('email_contacts')
    .select('id')
    .eq('sender_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) return { ok: false, error: '이미 이 게시글에 이메일을 보냈습니다.' }

  // 게시글 + 작성자 contact_email 조회
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('title, contact_email, user(nickname, email)')
    .eq('id', postId)
    .single()

  if (postError || !post) return { ok: false, error: '게시글을 찾을 수 없습니다.' }

  const contactEmail = post.contact_email
  if (!contactEmail) return { ok: false, error: '이 게시글에는 연락처 이메일이 없습니다.' }

  // 보내는 사람 프로필
  const { data: senderProfile } = await supabase
    .from('user')
    .select('nickname, email')
    .eq('id', user.id)
    .single()

  const senderNickname = senderProfile?.nickname ?? '도감 이용자'
  const senderEmail = senderProfile?.email ?? user.email ?? ''

  const postAuthor = Array.isArray(post.user) ? post.user[0] : post.user
  const authorNickname = postAuthor?.nickname ?? '작성자'

  const { error: sendError } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: contactEmail,
    subject: `[제주 새활용 도감] "${post.title}" 게시글에 연락이 왔어요`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1c1a17;">
        <p style="font-size: 15px; margin-bottom: 8px;">안녕하세요, <strong>${authorNickname}</strong>님.</p>
        <p style="font-size: 15px; margin-bottom: 24px;">
          <a href="https://www.jeju-upcycle-dogam.kr/posts/${postId}" style="color: #2b2823; font-weight: 600;">"${post.title}"</a>
          게시글에 <strong>${senderNickname}</strong>님이 연락을 남겼습니다.
        </p>
        <blockquote style="border-left: 3px solid #e5dfd2; margin: 0; padding: 12px 16px; background: #fbf9f4; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${senderMessage}</blockquote>
        <p style="font-size: 14px; color: #6b6557; margin-top: 24px;">
          답장하려면 <a href="mailto:${senderEmail}" style="color: #2b2823;">${senderEmail}</a>로 직접 연락하세요.
        </p>
        <hr style="border: none; border-top: 1px solid #e5dfd2; margin: 32px 0;" />
        <p style="font-size: 12px; color: #6b6557;">
          제주 새활용 도감 &middot; <a href="https://www.jeju-upcycle-dogam.kr" style="color: #6b6557;">jeju-upcycle-dogam.kr</a>
        </p>
      </div>
    `,
  })

  if (sendError) {
    console.error('sendContactEmail resend error:', sendError)
    return { ok: false, error: '이메일 전송에 실패했습니다.' }
  }

  // 이력 저장
  await supabase
    .from('email_contacts')
    .insert({ sender_id: user.id, post_id: postId })

  revalidatePath('/my')
  return { ok: true }
}
