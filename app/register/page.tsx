import Link from 'next/link'
import { RegisterForm } from '@/frontend/components/RegisterForm'

export default function RegisterPage() {
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
        <RegisterForm />
      </main>
    </div>
  )
}
