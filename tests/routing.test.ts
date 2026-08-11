import { describe, expect, it } from 'vitest'
import { timetable } from '../src/domain/data'
import { findNextServiceDate, getServiceStatus } from '../src/domain/calendar'
import { searchRoutes } from '../src/domain/routing'

const serviceDay = '2026-10-01'

describe('2026 timetable dataset', () => {
  it('contains all 79 official trips', () => {
    expect(timetable.trips).toHaveLength(79)
    expect(timetable.trips.filter((trip) => trip.direction === 'TO_SU')).toHaveLength(40)
    expect(timetable.trips.filter((trip) => trip.direction === 'SU_TO')).toHaveLength(39)
  })

  it('keeps official stop times for representative outbound trips', () => {
    const trip2 = timetable.trips.find((trip) => trip.id === 'O-02')
    expect(trip2?.stopTimes).toEqual([
      { stopId: 'toy', time: '08:00' },
      { stopId: 'convention', time: '08:25' },
      { stopId: 'engineering', time: '08:30' },
    ])

    const trip8 = timetable.trips.find((trip) => trip.id === 'O-08')
    expect(trip8?.stopTimes.map((stop) => stop.time)).toEqual(['09:20', '09:40', '09:55', '10:00'])
  })

  it('keeps official stop times for representative return trips', () => {
    const trip1 = timetable.trips.find((trip) => trip.id === 'I-01')
    expect(trip1?.stopTimes.map((stop) => stop.time)).toEqual(['07:55', '08:00', '08:20', '08:40'])
  })
})

describe('service calendar', () => {
  it('marks the 2026 summer closure as non-operating', () => {
    expect(getServiceStatus('2026-08-12').operates).toBe(false)
    expect(getServiceStatus('2026-09-30').operates).toBe(false)
  })

  it('marks Mountain Day as a holiday', () => {
    expect(getServiceStatus('2026-08-11').kind).toBe('holiday')
  })

  it('finds the next regular service after August 11', () => {
    expect(findNextServiceDate('2026-08-11')).toBe('2026-10-01')
  })
})

describe('route search', () => {
  it('finds the next Toyonaka to Suita service', () => {
    const routes = searchRoutes({ from: 'TOYONAKA', to: 'SUITA', date: serviceDay, time: '09:10', mode: 'departure' })
    expect(routes[0]).toMatchObject({ tripId: 'O-08', departure: '09:20', arrival: '10:00', direct: false })
  })

  it('prefers direct Toyonaka to Suita trips when requested', () => {
    const routes = searchRoutes({ from: 'TOYONAKA', to: 'SUITA', date: serviceDay, time: '09:10', mode: 'departure', preference: 'direct' })
    expect(routes[0]).toMatchObject({ tripId: 'O-09', departure: '09:45', arrival: '10:15', direct: true })
  })

  it('supports arrive-by search', () => {
    const routes = searchRoutes({ from: 'SUITA', to: 'TOYONAKA', date: serviceDay, time: '10:00', mode: 'arrival' })
    expect(routes[0]).toMatchObject({ tripId: 'I-06', departure: '09:30', arrival: '10:00' })
  })

  it('returns no normal routes on a non-service day', () => {
    expect(searchRoutes({ from: 'TOYONAKA', to: 'SUITA', date: '2026-08-11', time: '09:00', mode: 'departure' })).toEqual([])
  })
})
