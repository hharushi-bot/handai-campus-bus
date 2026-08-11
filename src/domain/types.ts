export type CampusId = 'TOYONAKA' | 'MINOH' | 'SUITA'
export type Direction = 'TO_SU' | 'SU_TO'

export type Stop = {
  id: string
  name: string
  campus: CampusId
  shortName: string
}

export type Campus = {
  id: CampusId
  name: string
  defaultStopId: string
  latitude: number
  longitude: number
  radiusKm: number
}

export type StopTime = {
  stopId: string
  time: string
}

export type Trip = {
  id: string
  direction: Direction
  number: number
  stopTimes: StopTime[]
}

export type TimetableDataset = {
  academicYear: number
  source: { title: string; url: string; retrievedAt: string }
  stops: Stop[]
  campuses: Campus[]
  trips: Trip[]
}

export type CalendarDataset = {
  academicYear: number
  validFrom: string
  validTo: string
  weekdaysOnly: boolean
  source: { title: string; url: string; retrievedAt: string }
  exclusionRanges: Array<{ from: string; to: string; reason: string }>
  specialServiceDates: Array<{ from: string; to: string; reason: string }>
  holidays: string[]
  holidaySource: { title: string; url: string; retrievedAt: string }
}

export type ServiceStatus = {
  kind: 'regular' | 'weekend' | 'holiday' | 'excluded' | 'special' | 'outside'
  operates: boolean
  message: string
}

export type SearchMode = 'departure' | 'arrival'
export type SearchPreference = 'soonest' | 'direct'

export type RouteQuery = {
  from: CampusId
  to: CampusId
  date: string
  time: string
  mode: SearchMode
  preference?: SearchPreference
  limit?: number
}

export type RouteResult = {
  tripId: string
  tripNumber: number
  direction: Direction
  from: CampusId
  to: CampusId
  departureStopId: string
  arrivalStopId: string
  departure: string
  arrival: string
  durationMinutes: number
  direct: boolean
  stopTimes: StopTime[]
}
