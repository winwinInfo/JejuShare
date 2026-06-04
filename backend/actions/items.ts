'use server'

import { supabase } from '@/backend/supabase'

export type ListingForm = {
  type: string
  usage: string
  detail: string
  phone: string
  email: string
  address: string
}

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function createListing(form: ListingForm): Promise<ActionResult> {
  // 1. owner 먼저 저장
  const { data: ownerData, error: ownerError } = await supabase
    .from('owners')
    .insert({
      phone: form.phone || null,
      email: form.email || null,
      location: form.address ? { address: form.address } : null,
    })
    .select()
    .single()

  if (ownerError || !ownerData) {
    return { ok: false, error: '등록 중 오류가 발생했습니다. 다시 시도해주세요.' }
  }

  // 2. item 저장
  const { error: itemError } = await supabase
    .from('items')
    .insert({
      type: form.type,
      usage: form.usage || null,
      description: form.detail ? { detail: form.detail } : null,
      owner_id: ownerData.id,
    })

  if (itemError) {
    return { ok: false, error: '등록 중 오류가 발생했습니다. 다시 시도해주세요.' }
  }

  return { ok: true }
}
