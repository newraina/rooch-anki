// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import { Providers } from '@/components/providers'

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
