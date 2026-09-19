import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PoseMaster AI — Perfect Poses for Every Occasion',
  description: 'AI-powered photo pose suggestions for singles, couples, groups & families. Get perfect poses with step-by-step instructions for any occasion.',
  keywords: 'photo poses, AI poses, group poses, couple poses, family poses, wedding poses, photo guide',
  openGraph: {
    title: 'PoseMaster AI',
    description: 'AI-powered photo pose suggestions for any group size',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  )
}
