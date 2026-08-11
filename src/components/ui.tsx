'use client'

import { CalendarDays, ChevronDown, Circle } from 'lucide-react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Button({ variant = 'neutral', icon, className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'neutral' | 'primary'; icon?: ReactNode }) {
  return <button className={`ui-button ${variant === 'primary' ? 'ui-button--primary' : ''} ${className}`.trim()} type="button" {...props}>{icon}{children}</button>
}

export function IconButton({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`ui-icon-button ${className}`.trim()} type="button" {...props}>{children}</button>
}

export function TextField({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`ui-input ${className}`.trim()} {...props} />
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="ui-field"><span>{label}</span>{children}</label>
}

export function SelectControl({ label, options, value, onChange, fullWidth }: { label: string; options: readonly { value: string; label: string }[]; value: string; onChange: (value: string) => void; fullWidth?: boolean }) {
  return <span className={`ui-select ${fullWidth ? 'is-full' : ''}`}>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
    <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" />
  </span>
}

export function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <span className="ui-date"><input aria-label={label} type="date" value={value} onChange={(event) => onChange(event.target.value)} /><CalendarDays size={15} strokeWidth={1.75} aria-hidden="true" /></span>
}

export function SegmentedControl<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <div className="ui-segmented" role="group" aria-label={label}>{options.map((option) => <button type="button" aria-pressed={value === option} className={value === option ? 'is-selected' : ''} onClick={() => onChange(option)} key={option}>{option}</button>)}</div>
}

export function Notice({ tone = 'info', title, description }: { tone?: 'info' | 'warning'; title: string; description?: string }) {
  return <div className={`ui-notice ui-notice--${tone}`} role="status"><strong>{title}</strong>{description && <span>{description}</span>}</div>
}

export function SectionHeading({ title, meta }: { title: string; meta?: string }) {
  return <div className="ui-section-heading"><h2>{title}</h2>{meta && <span>{meta}</span>}</div>
}

export function DataList({ children }: { children: ReactNode }) { return <div className="ui-data-list">{children}</div> }
export function DataRow({ leading, title, meta, aside, className = '' }: { leading?: ReactNode; title: ReactNode; meta?: ReactNode; aside?: ReactNode; className?: string }) {
  return <div className={`ui-data-row ${className}`.trim()}><div className="ui-data-row__leading">{leading}</div><div className="ui-data-row__body"><div className="ui-data-row__title">{title}</div>{meta && <div className="ui-data-row__meta">{meta}</div>}</div>{aside && <div className="ui-data-row__aside">{aside}</div>}</div>
}
export function Badge({ children }: { children: ReactNode }) { return <span className="ui-badge">{children}</span> }
export function StatusIndicator({ label, tone = 'active' }: { label: string; tone?: 'active' | 'review' }) { return <span className={`ui-status ui-status--${tone}`}><Circle size={7} fill="currentColor" strokeWidth={0} aria-hidden="true" />{label}</span> }
export function EmptyState({ title, description }: { title: string; description?: string }) { return <div className="ui-empty"><strong>{title}</strong>{description && <span>{description}</span>}</div> }
