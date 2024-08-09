'use client'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <Footer />
    </div>
  )
}
