import { timetable } from './data'
import type { CampusId } from './types'

const earthRadiusKm = 6371
const rad = (value: number) => value * Math.PI / 180

export function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const dLat = rad(b.latitude - a.latitude)
  const dLon = rad(b.longitude - a.longitude)
  const lat1 = rad(a.latitude)
  const lat2 = rad(b.latitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h))
}

export function detectCampus(latitude: number, longitude: number): CampusId | null {
  const point = { latitude, longitude }
  const candidates = timetable.campuses
    .map((campus) => ({ campus, distance: distanceKm(point, campus) }))
    .sort((a, b) => a.distance - b.distance)
  const nearest = candidates[0]
  if (!nearest || nearest.distance > nearest.campus.radiusKm) return null
  return nearest.campus.id
}
