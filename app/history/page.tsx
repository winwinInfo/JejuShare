import { redirect } from 'next/navigation'

// 늬우스 목록은 홈의 클라이언트 탭으로 통합됨. 기존 /history 링크 보존용 리다이렉트.
export default function HistoryPage() {
  redirect('/?tab=news')
}
