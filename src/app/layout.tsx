import type { Metadata } from 'next'
import './product.css'

const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/handai-campus-bus' : ''

export const metadata: Metadata = {
  title: '阪大バス | 学内連絡バス検索',
  description: '大阪大学の豊中・箕面・吹田キャンパス間を走る学内連絡バスの時刻検索アプリ',
  manifest: `${basePath}/manifest.webmanifest`,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>
}
