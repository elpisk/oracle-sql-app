'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, saveProfile } from '@/lib/store'

export default function ProfileSetup() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', cohort: '' })
  const [error, setError] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (p) { setForm({ name: p.name, email: p.email, cohort: p.cohort }); setIsEdit(true) }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setError('이름과 이메일을 입력해주세요.'); return }
    saveProfile({ ...form, createdAt: new Date().toISOString() })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-apple-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md fade-up">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-apple-blue flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-2xl font-bold">ORA</span>
          </div>
          <h1 className="text-3xl font-bold text-apple-text mb-2">
            {isEdit ? '프로필 수정' : '학습 시작하기'}
          </h1>
          <p className="text-apple-secondary text-[15px]">
            {isEdit ? '정보를 수정하세요.' : '이름과 이메일을 입력하면 바로 시작할 수 있어요.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-apple-xl shadow-apple-md p-8 space-y-5">
          {[
            { id: 'name',   label: '이름',        type: 'text',  placeholder: '홍길동' },
            { id: 'email',  label: '이메일',       type: 'email', placeholder: 'hong@example.com' },
            { id: 'cohort', label: '소속 / 기수',  type: 'text',  placeholder: '2024년 1기' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-[13px] font-semibold text-apple-text mb-2">{label}</label>
              <input id={id} type={type} placeholder={placeholder}
                value={form[id as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
                className="w-full h-11 px-4 rounded-apple border border-apple-border bg-apple-bg text-apple-text text-[15px]
                  placeholder:text-apple-tertiary focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all" />
            </div>
          ))}

          {error && <p className="text-apple-red text-[13px]">{error}</p>}

          <button type="submit"
            className="w-full h-12 bg-apple-blue hover:bg-apple-blue-dark text-white font-semibold text-[15px] rounded-full transition-colors mt-2">
            {isEdit ? '저장하기' : '학습 시작하기'}
          </button>
        </form>

        <p className="text-center text-[12px] text-apple-tertiary mt-6">
          입력 정보는 이 기기에만 저장되며, 문의 제출 시 강사에게 공유됩니다.
        </p>
      </div>
    </div>
  )
}
