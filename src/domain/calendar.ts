import { serviceCalendar } from './data'
import { parseDateKey, toDateKey } from './time'
import type { ServiceStatus } from './types'

function inRange(date: string, from: string, to: string) {
  return date >= from && date <= to
}

export function getServiceStatus(date: string): ServiceStatus {
  if (date < serviceCalendar.validFrom || date > serviceCalendar.validTo) {
    return { kind: 'outside', operates: false, message: '2026年度ダイヤの対象期間外です。' }
  }

  const special = serviceCalendar.specialServiceDates.find((range) => inRange(date, range.from, range.to))
  if (special) {
    return { kind: 'special', operates: false, message: `${special.reason}。このアプリには通常ダイヤのみ収録しています。` }
  }

  const excluded = serviceCalendar.exclusionRanges.find((range) => inRange(date, range.from, range.to))
  if (excluded) {
    return { kind: 'excluded', operates: false, message: `運休日です（${excluded.reason}）。` }
  }

  if (serviceCalendar.holidays.includes(date)) {
    return { kind: 'holiday', operates: false, message: '祝日のため運休です。' }
  }

  const weekday = parseDateKey(date).getDay()
  if (weekday === 0 || weekday === 6) {
    return { kind: 'weekend', operates: false, message: weekday === 6 ? '土曜日のため運休です。' : '日曜日のため運休です。' }
  }

  return { kind: 'regular', operates: true, message: '通常ダイヤで運行予定です。' }
}

export function findNextServiceDate(date: string, maxDays = 370) {
  let cursor = parseDateKey(date)
  for (let index = 0; index < maxDays; index += 1) {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
    const key = toDateKey(cursor)
    if (getServiceStatus(key).operates) return key
  }
  return null
}
