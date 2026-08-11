import { BusFront } from 'lucide-react'

export function AppHeader() {
  return <header className="app-header">
    <div className="app-header__inner">
      <a className="app-brand" href="/" aria-label="阪大バス ホーム">
        <BusFront size={18} strokeWidth={1.75} aria-hidden="true" />
        <span>阪大バス</span>
      </a>
      <span className="app-header__meta">2026年度ダイヤ</span>
    </div>
  </header>
}
