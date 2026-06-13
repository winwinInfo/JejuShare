'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/backend/actions/posts'
import { getSupabaseBrowser } from '@/frontend/lib/supabase-browser'
import type { PostType } from '@/backend/types'

const JEJU_REGIONS = [
  // 제주시 동지역
  '제주시 일도1동', '제주시 일도2동', '제주시 이도1동', '제주시 이도2동',
  '제주시 삼도1동', '제주시 삼도2동', '제주시 용담1동', '제주시 용담2동',
  '제주시 건입동', '제주시 화북동', '제주시 삼양동', '제주시 봉개동',
  '제주시 아라동', '제주시 오라동', '제주시 연동', '제주시 노형동',
  '제주시 외도동', '제주시 이호동', '제주시 도두동',
  // 제주시 읍면
  '제주시 한경면', '제주시 한림읍', '제주시 애월읍', '제주시 조천읍',
  '제주시 구좌읍', '제주시 우도면', '제주시 추자면',
  // 서귀포시 동지역
  '서귀포시 송산동', '서귀포시 정방동', '서귀포시 중앙동', '서귀포시 천지동',
  '서귀포시 효돈동', '서귀포시 영천동', '서귀포시 동홍동', '서귀포시 서홍동',
  '서귀포시 대륜동', '서귀포시 대천동', '서귀포시 중문동', '서귀포시 예래동',
  // 서귀포시 읍면
  '서귀포시 대정읍', '서귀포시 남원읍', '서귀포시 성산읍',
  '서귀포시 안덕면', '서귀포시 표선면',
]

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const MAX_PX = 1200
      let { width, height } = img
      if (width > MAX_PX || height > MAX_PX) {
        if (width >= height) {
          height = Math.round((height * MAX_PX) / width)
          width = MAX_PX
        } else {
          width = Math.round((width * MAX_PX) / height)
          height = MAX_PX
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(objectUrl)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('압축 실패'))),
        'image/webp',
        0.82
      )
    }
    img.onerror = () => reject(new Error('이미지 로드 실패'))
    img.src = objectUrl
  })
}

export function PostNewForm({ userId, defaultEmail }: { userId: string; defaultEmail: string }) {
  const [postType, setPostType] = useState<PostType>('offer')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [region, setRegion] = useState('')
  const [contactEmail, setContactEmail] = useState(defaultEmail)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)

    // 미리보기
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const blob = await compressImage(file)
      const supabase = getSupabaseBrowser()
      const path = `${userId}/${Date.now()}.webp`
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(path, blob, { contentType: 'image/webp', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path)

      setUploadedImageUrl(publicUrl)
    } catch (err) {
      console.error('upload error:', err)
      setUploadError('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  function removeImage() {
    setImagePreview(null)
    setUploadedImageUrl(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (uploading) return
    setSubmitting(true)
    setError(null)

    const result = await createPost({
      postType,
      title,
      body,
      region,
      imageUrl: uploadedImageUrl,
      contactEmail: contactEmail.trim() || null,
    })

    if (!result.ok) {
      setError(result.error)
      setSubmitting(false)
    }
    // ok이면 서버 액션이 redirect('/') 처리
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 게시 유형 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">게시 유형</label>
        <div className="flex gap-3">
          {(['offer', 'request'] as const).map((type) => {
            const label = type === 'offer' ? '있어요' : '구해요'
            const active =
              type === 'offer'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            const inactive = 'bg-background text-muted-foreground border-border'
            return (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  postType === type ? active : inactive
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 지역 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          지역 <span className="text-destructive">*</span>
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="">지역을 선택하세요</option>
          <optgroup label="제주시 동지역">
            {JEJU_REGIONS.filter((r) => r.startsWith('제주시') && !r.match(/읍|면/)).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </optgroup>
          <optgroup label="제주시 읍·면">
            {JEJU_REGIONS.filter((r) => r.startsWith('제주시') && r.match(/읍|면/)).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </optgroup>
          <optgroup label="서귀포시 동지역">
            {JEJU_REGIONS.filter((r) => r.startsWith('서귀포시') && !r.match(/읍|면/)).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </optgroup>
          <optgroup label="서귀포시 읍·면">
            {JEJU_REGIONS.filter((r) => r.startsWith('서귀포시') && r.match(/읍|면/)).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          제목 <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={80}
          placeholder="예: 감귤박 200kg 있어요, 톳 건조 원료 구해요"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* 내용 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          내용 <span className="text-destructive">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          placeholder="자원의 종류, 상태, 수량, 보관 방법 등 상세히 적어주세요."
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
        />
      </div>

      {/* 연락 이메일 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          연락받을 이메일 <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          placeholder="답장받을 이메일 주소"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">카카오 계정 이메일이 기본으로 입력됩니다. 다른 주소로 변경할 수 있어요.</p>
      </div>

      {/* 이미지 */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          사진 <span className="text-muted-foreground/60">(선택)</span>
        </label>

        {imagePreview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="미리보기"
              className="w-full max-h-64 object-cover rounded-lg border border-border"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60">
                <span className="text-sm text-muted-foreground">업로드 중…</span>
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-foreground/80 p-1 text-background hover:bg-foreground transition-colors"
                aria-label="이미지 제거"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-muted-foreground hover:border-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-xs">클릭하여 사진 추가</span>
            <span className="text-xs opacity-60">JPG · PNG · WebP · GIF · 최대 5MB</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageSelect}
          className="hidden"
        />

        {uploadError && (
          <p className="mt-1.5 text-xs text-destructive">{uploadError}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        {submitting ? '등록 중…' : '도감에 올리기'}
      </button>
    </form>
  )
}
