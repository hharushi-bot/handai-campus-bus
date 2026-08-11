import timetableJson from '@/data/2026/timetable.json'
import calendarJson from '@/data/2026/calendar.json'
import type { CalendarDataset, TimetableDataset } from './types'

export const timetable = timetableJson as TimetableDataset
export const serviceCalendar = calendarJson as CalendarDataset

export const campusById = Object.fromEntries(timetable.campuses.map((campus) => [campus.id, campus])) as Record<string, TimetableDataset['campuses'][number]>
export const stopById = Object.fromEntries(timetable.stops.map((stop) => [stop.id, stop])) as Record<string, TimetableDataset['stops'][number]>
