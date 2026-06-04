import { Category } from '@/backend/types'
import { CATEGORY_META } from '@/frontend/lib/category'
import { cn } from '@/frontend/lib/utils'

/**
 * 1:1 대표 이미지 자리.
 * coverImageUrl이 있으면 이미지를, 없으면 카테고리 틴팅 + 코드 오버레이.
 * (실제 이미지 연동은 다음 패스)
 */
export function CoverPlaceholder({
  category,
  code,
  imageUrl,
  className,
}: {
  category: Category
  code: string
  imageUrl?: string | null
  className?: string
}) {
  const meta = CATEGORY_META[category]

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={code}
        className={cn('aspect-square w-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'relative flex aspect-square w-full items-center justify-center overflow-hidden',
        meta.tint,
        className,
      )}
    >
      <span className="absolute right-3 top-3 text-[2.5rem] font-semibold opacity-10">
        {meta.label}
      </span>
      <span className={cn('font-mono text-sm tracking-tight', meta.text)}>
        {code}
      </span>
    </div>
  )
}
