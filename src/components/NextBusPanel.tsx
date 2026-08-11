'use client'

import { LocateFixed, Navigation } from 'lucide-react'
import { Button, Notice, StatusIndicator } from '@/components/ui'
import { campusById, stopById } from '@/domain/data'
import { findNextServiceDate, getServiceStatus } from '@/domain/calendar'
import { nextRoutes } from '@/domain/routing'
import { formatDuration } from '@/domain/time'
import type { CampusId } from '@/domain/types'

export function NextBusPanel({ from, to, date, time, locationState, onLocate }: {
  from: CampusId
  to: CampusId
  date: string
  time: string
  locationState: 'idle' | 'locating' | 'located' | 'unavailable'
  onLocate: () => void
}) {
  const status = getServiceStatus(date)
  const next = status.operates ? nextRoutes(from, to, date, time, 1)[0] : undefined
  const nextDate = !status.operates ? findNextServiceDate(date) : null

  return <section className="next-bus-panel" aria-labelledby="next-bus-title">
    <div className="next-bus-panel__topline">
      <div>
        <span className="eyebrow">次に乗れる便</span>
        <h1 id="next-bus-title">{campusById[from]?.name}から{campusById[to]?.name}へ</h1>
      </div>
      <Button icon={<LocateFixed size={15} strokeWidth={1.75} aria-hidden="true" />} onClick={onLocate} disabled={locationState === 'locating'}>
        {locationState === 'locating' ? '現在地を確認中' : locationState === 'located' ? '現在地を更新' : '現在地を使う'}
      </Button>
    </div>

    {!status.operates ? <Notice
      tone="warning"
      title={status.message}
      description={nextDate ? `次の通常運行日は ${nextDate.replaceAll('-', '/')} です。` : '次の通常運行日を確認できませんでした。'}
    /> : next ? <div className="next-bus-main">
      <div className="next-bus-times"><strong>{next.departure}</strong><Navigation size={17} strokeWidth={1.75} aria-hidden="true" /><strong>{next.arrival}</strong></div>
      <div className="next-bus-details">
        <span>{stopById[next.departureStopId]?.name} → {stopById[next.arrivalStopId]?.name}</span>
        <span>{formatDuration(next.durationMinutes)} ・ 第{next.tripNumber}便</span>
      </div>
      <StatusIndicator label={next.direct ? '直行便' : '箕面経由'} tone={next.direct ? 'active' : 'review'} />
    </div> : <Notice tone="info" title="本日の便は終了しています" description="検索条件の日付を変更すると、次の運行日の便を確認できます。" />}
  </section>
}
