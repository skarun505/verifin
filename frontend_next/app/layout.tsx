import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'VeriFin - Financial Intelligence Platform',
    description: 'AI-powered financial analysis and company insights platform',
    keywords: ['finance', 'stocks', 'analysis', 'AI', 'investing'],
    authors: [{ name: 'VeriFin Team' }],
}

// Viewport configuration (separate export for Next.js 14+)
export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
