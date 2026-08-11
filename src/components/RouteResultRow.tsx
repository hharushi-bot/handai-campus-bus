import { ArrowRight, MapPin } from 'lucide-react'
import { Badge, DataRow } from '@/components/ui'
import { stopById } from '@/domain/data'
import { formatDuration } from '@/domain/time'
import type { RouteResult } from '@/domain/types'

export function RouteResultRow({ route }: { route: RouteResult }) {
  const stopLabels = route.stopTimes.map((item) => stopById[item.stopId]?.shortName ?? item.stopId)
  return <DataRow
    className="route-row"
    leading={<div className="route-time-block"><strong>{route.departure}</strong><ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" /><strong>{route.arrival}</strong></div>}
    title={<span className="route-title">{stopById[route.departureStopId]?.shortName} <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" /> {stopById[route.arrivalStopId]?.shortName}</span>}
    meta={<span className="route-meta"><MapPin size={12} strokeWidth={1.75} aria-hidden="true" /> {stopLabels.join(' → ')} ・ {formatDuration(route.durationMinutes)}</span>}
    aside={<div className="route-aside">{route.direct && <Badge>直行</Badge>}<span>第{route.tripNumber}便</span></div>}
  />
}
