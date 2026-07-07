'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { setAdminAuth } from '@/lib/store'

const ADMIN_PASSWORD = 'oracle1234'

export default function AdminLoginPage() {
  const router = useRouter()
  const [pw, setPw]         = useState('')
  const [show, setShow]     = useState(false)
  const [error, setError]   = useState(false)
  const [shaking, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAdminAuth(true)
      router.replace('/admin/dashboard')
    } else {
      setError(true)
      setShake(true)
      setPw('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-apple-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 아이콘 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1D1D1F] to-[#3A3A3C] flex items-center justify-center mb-4 shadow-apple-md">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-apple-text">관리자 로그인</h1>
          <p className="text-[13px] text-apple-secondary mt-1">Oracle SQL Workshop</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}
          className={`bg-white rounded-apple-xl shadow-apple p-6 space-y-4 ${shaking ? 'animate-shake' : ''}`}>
          <div>
            <label className="block text-[13px] font-semibold text-apple-text mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(false) }}
                placeholder="관리자 비밀번호 입력"
                autoFocus
                className={`w-full h-11 rounded-apple border px-4 pr-10 text-[14px] focus:outline-none transition-colors placeholder:text-apple-tertiary ${
                  error
                    ? 'border-red-400 focus:border-red-400 bg-red-50'
                    : 'border-apple-border focus:border-apple-blue'
                }`}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-tertiary hover:text-apple-secondary">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-[12px] text-red-500 mt-1.5">비밀번호가 올바르지 않습니다.</p>
            )}
          </div>

          <button type="submit"
            className="w-full h-11 rounded-full bg-apple-blue hover:bg-apple-blue-dark text-white text-[15px] font-semibold transition-colors">
            로그인
          </button>
        </form>

        <p className="text-center text-[12px] text-apple-tertiary mt-4">
          학습자 화면으로 돌아가려면 <a href="/" className="text-apple-blue hover:underline">홈으로</a>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  )
}
