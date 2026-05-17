import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'NieuwsLeren — Eenvoudig Nederlands leren',
  description: 'Elke dag nieuws in eenvoudig Nederlands. Speciaal voor A2, A2+ en B1 taalleerders.',
  metadataBase: new URL('https://nieuwsleren.nl'),
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'NieuwsLeren — Eenvoudig Nederlands leren',
    description: 'Elke dag 6 nieuwsartikelen in eenvoudig Nederlands voor A2, A2+ en B1 leerders. Met woordenlijst en audio!',
    url: 'https://nieuwsleren.nl',
    siteName: 'NieuwsLeren',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NieuwsLeren — Eenvoudig Nederlands leren',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NieuwsLeren — Eenvoudig Nederlands leren',
    description: 'Elke dag nieuws in eenvoudig Nederlands voor taalleerders.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Nunito:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}