import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Oracle 19c SQL Workshop',
  description: 'Oracle Database 19c SQL 학습 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-apple-bg min-h-screen" suppressHydrationWarning>
        <Nav />
        <main className="pt-[52px]">{children}</main>
      </body>
    </html>
  )
}
