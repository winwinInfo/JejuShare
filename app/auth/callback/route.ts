import { handleAuthCallback } from '@/backend/queries/auth'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return handleAuthCallback(request)
}
