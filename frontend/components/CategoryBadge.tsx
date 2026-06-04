import { Category } from '@/backend/types'
import { CATEGORY_META } from '@/frontend/lib/category'
import { cn } from '@/frontend/lib/utils'

export function CategoryBadge({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  const meta = CATEGORY_META[category]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight',
        meta.badge,
        className,
      )}
    >
      {meta.full}
    </span>
  )
}
