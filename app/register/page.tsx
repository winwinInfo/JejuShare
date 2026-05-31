'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: '',
    usage: '',
    detail: '',
    phone: '',
    email: '',
    address: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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
      setError('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
      return
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
      setError('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  const byproductTypes = [
    '감귤 껍질', '감귤 부산물', '당근 잎/줄기', '브로콜리 잎', '양배추 외엽',
    '무 잎/줄기', '콩깍지', '볏짚', '기타',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
            ← 목록으로
          </Link>
          <h1 className="text-lg font-bold text-green-700">부산물 등록</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부산물 종류 <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">선택하세요</option>
              {byproductTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              활용처 (예: 사료, 퇴비, 식품가공)
            </label>
            <input
              type="text"
              name="usage"
              value={form.usage}
              onChange={handleChange}
              placeholder="어떻게 활용할 수 있는지 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 설명
            </label>
            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              placeholder="수량, 상태, 수거 조건 등 자유롭게 입력하세요"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              위치 (예: 제주시 애월읍)
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="농장 또는 수거 가능 위치"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="010-0000-0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 (선택)
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </main>
    </div>
  )
}
