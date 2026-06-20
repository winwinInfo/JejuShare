import { redirect } from 'next/navigation'

// 도감은 홈의 클라이언트 탭으로 통합됨. 기존 /dogam 링크 보존용 리다이렉트.
export default function DogamPage() {
  redirect('/?tab=dogam')
}
