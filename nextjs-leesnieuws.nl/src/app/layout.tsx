import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'NieuwsLeren — Eenvoudig Nederlands',
  description: 'Dagelijks nieuws in eenvoudig Nederlands voor A2 en B1 leerders.',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Nunito:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}