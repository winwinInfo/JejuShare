/*
  Supabase 테이블 타입
*/

export type Owner = {
  id: number
  created_at: string
  email: string | null
  phone: string | null
  location: { address: string } | null
}

export type Item = {
  id: number
  created_at: string
  type: string | null
  usage: string | null
  description: { detail: string } | null
  owner_id: number | null
  owners?: Owner
}
