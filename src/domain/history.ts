'use client'

import type { CampusId } from './types'

type RouteHistory = {
  from: CampusId
  to: CampusId
  count: number
  lastUsedAt: number
}

const KEY = 'handai-bus-route-history-v1'

export function readHistory(): RouteHistory[] {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function recordRoute(from: CampusId, to: CampusId) {
  if (typeof window === 'undefined') return
  const history = readHistory()
  const found = history.find((entry) => entry.from === from && entry.to === to)
  if (found) {
    found.count += 1
    found.lastUsedAt = Date.now()
  } else {
    history.push({ from, to, count: 1, lastUsedAt: Date.now() })
  }
  window.localStorage.setItem(KEY, JSON.stringify(history.sort((a, b) => b.count - a.count || b.lastUsedAt - a.lastUsedAt).slice(0, 12)))
}

export function suggestDestination(from: CampusId): CampusId {
  const learned = readHistory().filter((entry) => entry.from === from).sort((a, b) => b.count - a.count || b.lastUsedAt - a.lastUsedAt)[0]
  if (learned) return learned.to
  if (from === 'TOYONAKA') return 'SUITA'
  if (from === 'SUITA') return 'TOYONAKA'
  return 'TOYONAKA'
}
