'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDownUp, Search } from 'lucide-react'
import { Button, DataList, DatePicker, EmptyState, FormField, IconButton, Notice, SectionHeading, SegmentedControl, SelectControl, TextField } from '@/components/ui'
import { campusById } from '@/domain/data'
import { detectCampus } from '@/domain/location'
import { recordRoute, suggestDestination } from '@/domain/history'
import { searchRoutes } from '@/domain/routing'
import { getServiceStatus } from '@/domain/calendar'
import { toDateKey, toTimeKey } from '@/domain/time'
import type { CampusId, RouteResult, SearchMode, SearchPreference } from '@/domain/types'
import { NextBusPanel } from './NextBusPanel'
import { RouteResultRow } from './RouteResultRow'

const campuses = [
  { value: 'TOYONAKA', label: '豊中' },
  { value: 'MINOH', label: '箕面' },
  { value: 'SUITA', label: '吹田' },
] as const

const now = () => new Date()
const readLastFrom = (): CampusId => {
  if (typeof window === 'undefined') return 'TOYONAKA'
  const value = window.localStorage.getItem('handai-bus-last-from')
  return value === 'TOYONAKA' || value === 'MINOH' || value === 'SUITA' ? value : 'TOYONAKA'
}

export function BusSearchApp() {
  const initial = useMemo(now, [])
  const [from, setFrom] = useState<CampusId>('TOYONAKA')
  const [to, setTo] = useState<CampusId>('SUITA')
  const [date, setDate] = useState(toDateKey(initial))
  const [time, setTime] = useState(toTimeKey(initial))
  const [modeLabel, setModeLabel] = useState<'出発' | '到着'>('出発')
  const [preferenceLabel, setPreferenceLabel] = useState<'早い便' | '直行優先'>('早い便')
  const [tripType, setTripType] = useState<'片道' | '往復'>('片道')
  const [returnDate, setReturnDate] = useState(toDateKey(initial))
  const [returnTime, setReturnTime] = useState('16:00')
  const [returnModeLabel, setReturnModeLabel] = useState<'出発' | '到着'>('出発')
  const [results, setResults] = useState<RouteResult[] | null>(null)
  const [returnResults, setReturnResults] = useState<RouteResult[] | null>(null)
  const [locationState, setLocationState] = useState<'idle' | 'locating' | 'located' | 'unavailable'>('idle')

  useEffect(() => {
    const rememberedFrom = readLastFrom()
    setFrom(rememberedFrom)
    setTo(suggestDestination(rememberedFrom))
    if (!navigator.permissions?.query) return
    navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
      if (permission.state === 'granted') locate(false)
    }).catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mode: SearchMode = modeLabel === '出発' ? 'departure' : 'arrival'
  const preference: SearchPreference = preferenceLabel === '直行優先' ? 'direct' : 'soonest'
  const returnMode: SearchMode = returnModeLabel === '出発' ? 'departure' : 'arrival'

  function changeFrom(value: string) {
    const nextFrom = value as CampusId
    setFrom(nextFrom)
    if (nextFrom === to) setTo(suggestDestination(nextFrom))
  }

  function changeTo(value: string) {
    setTo(value as CampusId)
  }

  function swap() {
    setFrom(to)
    setTo(from)
  }

  function locate(updateDestination = true) {
    if (!navigator.geolocation) {
      setLocationState('unavailable')
      return
    }
    setLocationState('locating')
    navigator.geolocation.getCurrentPosition((position) => {
      const detected = detectCampus(position.coords.latitude, position.coords.longitude)
      if (!detected) {
        setLocationState('unavailable')
        return
      }
      setFrom(detected)
      window.localStorage.setItem('handai-bus-last-from', detected)
      if (updateDestination) setTo(suggestDestination(detected))
      setLocationState('located')
    }, () => setLocationState('unavailable'), { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 })
  }

  function submit() {
    const nextResults = searchRoutes({ from, to, date, time, mode, preference, limit: 8 })
    setResults(nextResults)
    recordRoute(from, to)
    window.localStorage.setItem('handai-bus-last-from', from)

    if (tripType === '往復') {
      setReturnResults(searchRoutes({ from: to, to: from, date: returnDate, time: returnTime, mode: returnMode, preference, limit: 8 }))
    } else {
      setReturnResults(null)
    }
  }

  const todayStatus = getServiceStatus(date)

  return <main className="app-main">
    <div className="app-content">
      <NextBusPanel from={from} to={to} date={toDateKey(initial)} time={toTimeKey(initial)} locationState={locationState} onLocate={() => locate(true)} />

      <section className="search-section">
        <SectionHeading title="バスを検索" meta="豊中・箕面・吹田" />
        <div className="search-form">
          <div className="trip-type-row"><SegmentedControl label="片道または往復" options={['片道', '往復'] as const} value={tripType} onChange={setTripType} /></div>

          <div className="route-fields">
            <FormField label="出発">
              <SelectControl label="出発キャンパス" options={campuses} value={from} onChange={changeFrom} fullWidth />
            </FormField>
            <IconButton className="swap-button" aria-label="出発と到着を入れ替える" onClick={swap}><ArrowDownUp size={16} strokeWidth={1.75} aria-hidden="true" /></IconButton>
            <FormField label="到着">
              <SelectControl label="到着キャンパス" options={campuses} value={to} onChange={changeTo} fullWidth />
            </FormField>
          </div>

          <div className="time-fields">
            <FormField label="日付"><DatePicker label="検索日" value={date} onChange={setDate} /></FormField>
            <FormField label="時刻"><TextField type="time" value={time} onChange={(event) => setTime(event.target.value)} /></FormField>
            <div className="segmented-field"><span>時刻指定</span><SegmentedControl label="出発または到着時刻" options={['出発', '到着'] as const} value={modeLabel} onChange={setModeLabel} /></div>
          </div>

          {tripType === '往復' && <div className="return-panel">
            <span className="return-panel__title">帰り</span>
            <div className="time-fields">
              <FormField label="日付"><DatePicker label="帰りの日付" value={returnDate} onChange={setReturnDate} /></FormField>
              <FormField label="時刻"><TextField type="time" value={returnTime} onChange={(event) => setReturnTime(event.target.value)} /></FormField>
              <div className="segmented-field"><span>時刻指定</span><SegmentedControl label="帰りの出発または到着時刻" options={['出発', '到着'] as const} value={returnModeLabel} onChange={setReturnModeLabel} /></div>
            </div>
          </div>}

          <div className="search-actions">
            <SegmentedControl label="検索条件" options={['早い便', '直行優先'] as const} value={preferenceLabel} onChange={setPreferenceLabel} />
            <Button variant="primary" icon={<Search size={15} strokeWidth={1.75} aria-hidden="true" />} onClick={submit}>検索</Button>
          </div>
        </div>

        {!todayStatus.operates && <Notice tone="warning" title={todayStatus.message} description="この日付では通常ダイヤの検索結果は表示されません。" />}
        {locationState === 'unavailable' && <Notice tone="info" title="現在地からキャンパスを特定できませんでした" description="出発キャンパスは手動で選択できます。" />}
      </section>

      {results !== null && <section className="results-section">
        <SectionHeading title={tripType === '往復' ? '行き' : '検索結果'} meta={`${campusById[from]?.name} → ${campusById[to]?.name}`} />
        {results.length ? <DataList>{results.map((route) => <RouteResultRow route={route} key={route.tripId} />)}</DataList> : <EmptyState title="条件に合う便がありません" description="日付・時刻または直行優先の条件を変更して検索してください。" />}
      </section>}

      {tripType === '往復' && returnResults !== null && <section className="results-section">
        <SectionHeading title="帰り" meta={`${campusById[to]?.name} → ${campusById[from]?.name}`} />
        {returnResults.length ? <DataList>{returnResults.map((route) => <RouteResultRow route={route} key={`return-${route.tripId}`} />)}</DataList> : <EmptyState title="帰りの便がありません" description="帰りの日付や時刻を変更して検索してください。" />}
      </section>}

      <section className="source-section">
        <SectionHeading title="データについて" />
        <p>大阪大学が公開する2026年度学内連絡バス時刻表と運休日をもとにしています。道路・気象状況による遅延や運休はリアルタイム反映されません。</p>
        <div className="source-links"><a href="https://www.osaka-u.ac.jp/ja/access/bus" target="_blank" rel="noreferrer">大阪大学 公式時刻表</a><span>・</span><a href="https://www.hankyubus.co.jp/" target="_blank" rel="noreferrer">阪急バス</a></div>
      </section>
    </div>
  </main>
}
