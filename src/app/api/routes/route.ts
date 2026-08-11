import { NextRequest, NextResponse } from 'next/server'
import { getServiceStatus } from '@/domain/calendar'
import { searchRoutes } from '@/domain/routing'
import type { CampusId, SearchMode, SearchPreference } from '@/domain/types'

const campuses = new Set<CampusId>(['TOYONAKA', 'MINOH', 'SUITA'])
const modes = new Set<SearchMode>(['departure', 'arrival'])
const preferences = new Set<SearchPreference>(['soonest', 'direct'])

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const from = params.get('from') as CampusId
  const to = params.get('to') as CampusId
  const date = params.get('date') ?? ''
  const time = params.get('time') ?? ''
  const mode = (params.get('mode') ?? 'departure') as SearchMode
  const preference = (params.get('preference') ?? 'soonest') as SearchPreference

  if (!campuses.has(from) || !campuses.has(to) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !modes.has(mode) || !preferences.has(preference)) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
  }

  return NextResponse.json({
    service: getServiceStatus(date),
    routes: searchRoutes({ from, to, date, time, mode, preference, limit: 12 }),
  })
}
