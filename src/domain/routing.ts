import { campusById, stopById, timetable } from './data'
import { getServiceStatus } from './calendar'
import { timeToMinutes } from './time'
import type { CampusId, RouteQuery, RouteResult, Trip } from './types'

function defaultStop(campus: CampusId) {
  return campusById[campus]?.defaultStopId
}

function tripSegment(trip: Trip, fromStopId: string, toStopId: string) {
  const fromIndex = trip.stopTimes.findIndex((stop) => stop.stopId === fromStopId)
  const toIndex = trip.stopTimes.findIndex((stop) => stop.stopId === toStopId)
  if (fromIndex < 0 || toIndex <= fromIndex) return null
  return trip.stopTimes.slice(fromIndex, toIndex + 1)
}

function isDirectBetweenCampuses(segment: Trip['stopTimes'], from: CampusId, to: CampusId) {
  const crossesToyonakaSuita = new Set([from, to]).has('TOYONAKA') && new Set([from, to]).has('SUITA')
  if (!crossesToyonakaSuita) return true
  return !segment.some((stop) => stopById[stop.stopId]?.campus === 'MINOH')
}

export function searchRoutes(query: RouteQuery): RouteResult[] {
  if (query.from === query.to) return []
  if (!getServiceStatus(query.date).operates) return []

  const fromStopId = defaultStop(query.from)
  const toStopId = defaultStop(query.to)
  if (!fromStopId || !toStopId) return []

  const target = timeToMinutes(query.time)
  const results = timetable.trips.flatMap((trip) => {
    const segment = tripSegment(trip, fromStopId, toStopId)
    if (!segment) return []
    const first = segment[0]
    const last = segment.at(-1)
    if (!first || !last) return []
    const departureMinutes = timeToMinutes(first.time)
    const arrivalMinutes = timeToMinutes(last.time)
    const matches = query.mode === 'arrival' ? arrivalMinutes <= target : departureMinutes >= target
    if (!matches) return []

    return [{
      tripId: trip.id,
      tripNumber: trip.number,
      direction: trip.direction,
      from: query.from,
      to: query.to,
      departureStopId: first.stopId,
      arrivalStopId: last.stopId,
      departure: first.time,
      arrival: last.time,
      durationMinutes: arrivalMinutes - departureMinutes,
      direct: isDirectBetweenCampuses(segment, query.from, query.to),
      stopTimes: segment,
    } satisfies RouteResult]
  })

  results.sort((a, b) => {
    if (query.preference === 'direct' && a.direct !== b.direct) return a.direct ? -1 : 1
    if (query.mode === 'arrival') return timeToMinutes(b.departure) - timeToMinutes(a.departure)
    return timeToMinutes(a.departure) - timeToMinutes(b.departure)
  })

  return results.slice(0, query.limit ?? 6)
}

export function nextRoutes(from: CampusId, to: CampusId, date: string, time: string, limit = 3) {
  return searchRoutes({ from, to, date, time, mode: 'departure', preference: 'soonest', limit })
}
