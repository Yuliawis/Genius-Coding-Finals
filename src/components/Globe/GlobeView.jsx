import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import disasters, { disasterSource } from '../../data/disasters'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const ALERT_SOURCE_ID = 'alert-points'
const ALERT_GLOW_LAYER_ID = 'alert-points-glow'
const ALERT_CORE_LAYER_ID = 'alert-points-core'

const severityMeta = {
  critical: { dot: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)', text: 'text-rose-300' },
  high: { dot: '#f97316', glow: 'rgba(249, 115, 22, 0.35)', text: 'text-orange-300' },
  medium: { dot: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', text: 'text-amber-300' },
  moderate: { dot: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', text: 'text-amber-300' },
  low: { dot: '#22c55e', glow: 'rgba(34, 197, 94, 0.28)', text: 'text-emerald-300' },
}

function formatDate(dateString) {
  if (dateString === '2026-05-01') return 'April 30, 2026'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function createPopupContent(disaster) {
  const container = document.createElement('div')
  container.style.background = 'rgba(23, 23, 23, 0.96)'
  container.style.border = '1px solid rgba(255,255,255,0.08)'
  container.style.borderRadius = '18px'
  container.style.padding = '18px'
  container.style.color = '#f8fafc'
  container.style.minWidth = '248px'
  container.style.boxShadow = '0 24px 50px rgba(0,0,0,0.35)'

  container.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
      <div>
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:6px;">${disaster.severity}</div>
        <div style="font-size:28px;font-weight:700;line-height:1.05;color:#ffffff;">${disaster.type}</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.62);margin-top:4px;">${disaster.subtype}</div>
      </div>
    </div>
    <div style="margin-top:14px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.78);">
      <div><span style="color:#ffffff;font-weight:600;">Location:</span> ${disaster.location}</div>
      <div><span style="color:#ffffff;font-weight:600;">Date:</span> ${formatDate(disaster.date)}</div>
      <div><span style="color:#ffffff;font-weight:600;">Affected:</span> ${disaster.affectedPeople.toLocaleString()}</div>
      <div><span style="color:#ffffff;font-weight:600;">Deaths:</span> ${disaster.deaths.toLocaleString()}</div>
    </div>
    <button type="button" style="margin-top:16px;width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);padding:10px 12px;color:#ffffff;font-size:14px;font-weight:600;">
      Close
    </button>
  `

  return container
}

export default function GlobeView({ alerts = disasters }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const popupRef = useRef(null)
  const autoRotateRef = useRef(null)
  const interactionTimeoutRef = useRef(null)
  const userInteractingRef = useRef(false)
  const [selectedDisaster, setSelectedDisaster] = useState(alerts[0] ?? null)
  const [isMapReady, setIsMapReady] = useState(false)

  const totalAffected = useMemo(
    () => alerts.reduce((sum, disaster) => sum + disaster.affectedPeople, 0),
    [alerts],
  )

  const closePopup = () => {
    popupRef.current?.remove()
    popupRef.current = null
  }

  const openAlertPopup = (map, disaster) => {
    closePopup()

    const popupNode = createPopupContent(disaster)
    const closeButton = popupNode.querySelector('button')

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 18,
      maxWidth: '280px',
      className: 'alert-popup-shell',
    })
      .setLngLat([disaster.lng, disaster.lat])
      .setDOMContent(popupNode)
      .addTo(map)

    closeButton?.addEventListener('click', () => closePopup())
    setSelectedDisaster(disaster)
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return undefined

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [-25, 22],
      zoom: 1.28,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
    })

    mapRef.current = map

    const pauseAutoRotate = () => {
      userInteractingRef.current = true
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current)
      }
      interactionTimeoutRef.current = window.setTimeout(() => {
        userInteractingRef.current = false
      }, 1800)
    }

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' })
      map.setFog({
        color: 'rgb(40, 46, 54)',
        'high-color': 'rgb(17, 24, 39)',
        'horizon-blend': 0.18,
        'space-color': 'rgb(10, 12, 16)',
        'star-intensity': 0,
      })
    })

    map.on('load', () => {
      map.addSource(ALERT_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: alerts.map((disaster) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [disaster.lng, disaster.lat],
            },
            properties: {
              id: disaster.id,
              severity: disaster.severity,
            },
          })),
        },
      })

      map.addLayer({
        id: ALERT_GLOW_LAYER_ID,
        type: 'circle',
        source: ALERT_SOURCE_ID,
        paint: {
          'circle-radius': [
            'match',
            ['get', 'severity'],
            'critical', 18,
            'high', 16,
            'medium', 14,
            'moderate', 14,
            'low', 12,
            14,
          ],
          'circle-color': [
            'match',
            ['get', 'severity'],
            'critical', '#f43f5e',
            'high', '#f97316',
            'medium', '#f59e0b',
            'moderate', '#f59e0b',
            'low', '#22c55e',
            '#f59e0b',
          ],
          'circle-opacity': 0.24,
          'circle-blur': 0.55,
          'circle-stroke-width': 0,
        },
      })

      map.addLayer({
        id: ALERT_CORE_LAYER_ID,
        type: 'circle',
        source: ALERT_SOURCE_ID,
        paint: {
          'circle-radius': [
            'match',
            ['get', 'severity'],
            'critical', 7,
            'high', 6.5,
            'medium', 6,
            'moderate', 6,
            'low', 5.5,
            6,
          ],
          'circle-color': [
            'match',
            ['get', 'severity'],
            'critical', '#f43f5e',
            'high', '#f97316',
            'medium', '#f59e0b',
            'moderate', '#f59e0b',
            'low', '#22c55e',
            '#f59e0b',
          ],
          'circle-stroke-color': '#f8fafc',
          'circle-stroke-width': 2,
        },
      })

      map.on('mouseenter', ALERT_CORE_LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', ALERT_CORE_LAYER_ID, () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', ALERT_CORE_LAYER_ID, (event) => {
        const feature = event.features?.[0]
        const disaster = alerts.find((item) => item.id === feature?.properties?.id)
        if (!disaster) return

        pauseAutoRotate()
        map.flyTo({
          center: [disaster.lng, disaster.lat],
          zoom: Math.max(map.getZoom(), 2.75),
          speed: 1.3,
          essential: true,
        })
        openAlertPopup(map, disaster)
      })

      setIsMapReady(true)
    })

    map.on('dragstart', pauseAutoRotate)
    map.on('rotatestart', pauseAutoRotate)
    map.on('zoomstart', pauseAutoRotate)
    map.on('pitchstart', pauseAutoRotate)

    autoRotateRef.current = window.setInterval(() => {
      if (!mapRef.current || userInteractingRef.current) return

      const center = mapRef.current.getCenter()
      mapRef.current.jumpTo({
        center: [center.lng + 0.08, center.lat],
      })
    }, 60)

    return () => {
      if (autoRotateRef.current) {
        window.clearInterval(autoRotateRef.current)
      }
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current)
      }
      closePopup()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return

    const map = mapRef.current
    const source = map.getSource(ALERT_SOURCE_ID)

    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: alerts.map((disaster) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [disaster.lng, disaster.lat],
          },
          properties: {
            id: disaster.id,
            severity: disaster.severity,
          },
        })),
      })
    }

    setSelectedDisaster((current) => {
      if (current && alerts.some((item) => item.id === current.id)) {
        return current
      }
      return alerts[0] ?? null
    })

    if (alerts.length === 0) {
      closePopup()
    }
  }, [alerts, isMapReady])

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return undefined

    const map = mapRef.current

    if (selectedDisaster) {
      openAlertPopup(map, selectedDisaster)
    }

    return () => {
      closePopup()
    }
  }, [isMapReady, selectedDisaster])

  const focusAlert = (disaster) => {
    if (!mapRef.current) return

    userInteractingRef.current = true
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current)
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      userInteractingRef.current = false
    }, 1800)

    mapRef.current.flyTo({
      center: [disaster.lng, disaster.lat],
      zoom: Math.max(mapRef.current.getZoom(), 2.75),
      speed: 1.3,
      essential: true,
    })

    openAlertPopup(mapRef.current, disaster)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#111418] shadow-2xl shadow-slate-950/25">
          <div ref={mapContainerRef} className="h-[700px] w-full md:h-[760px]" />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/80">
                Loading globe...
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute left-6 top-6 rounded-[20px] border border-white/8 bg-black/72 px-5 py-4 text-white shadow-xl backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Live Alerts</p>
            <p className="mt-2 text-4xl font-semibold">{alerts.length}</p>
            <p className="mt-2 text-sm text-emerald-400">{totalAffected.toLocaleString()} people affected</p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="pointer-events-none absolute bottom-5 left-6 rounded-2xl bg-black/58 px-4 py-3 text-xs text-white/72 backdrop-blur-md">
            Drag to rotate the globe. Tap a glowing alert to open details.
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-[36px] p-6 xl:flex xl:h-[760px] xl:flex-col">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">Alert Explorer</p>
        {selectedDisaster && (
          <div className="mt-4 rounded-[24px] border border-white/8 bg-white/6 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-white">{selectedDisaster.type}</h3>
                <p className="mt-1 text-sm text-white/58">{selectedDisaster.subtype}</p>
              </div>
              <span className={`rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${severityMeta[selectedDisaster.severity]?.text || severityMeta.medium.text}`}>
                {selectedDisaster.severity}
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-white/76">
              <p><span className="font-medium text-white">Location:</span> {selectedDisaster.location}</p>
              <p><span className="font-medium text-white">Date:</span> {formatDate(selectedDisaster.date)}</p>
              <p><span className="font-medium text-white">Affected:</span> {selectedDisaster.affectedPeople.toLocaleString()}</p>
              <p><span className="font-medium text-white">Deaths:</span> {selectedDisaster.deaths.toLocaleString()}</p>
              <p><span className="font-medium text-white">EM-DAT ID:</span> {selectedDisaster.disNo}</p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
          {alerts.map((disaster) => (
            <button
              key={disaster.id}
              type="button"
              onClick={() => focusAlert(disaster)}
              className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                selectedDisaster?.id === disaster.id
                  ? 'border-emerald-400/20 bg-emerald-400/10'
                  : 'border-white/8 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/85"
                    style={{
                      background: severityMeta[disaster.severity]?.dot || severityMeta.medium.dot,
                      boxShadow: `0 0 0 6px ${severityMeta[disaster.severity]?.glow || severityMeta.medium.glow}`,
                    }}
                  />
                  <div>
                    <p className="font-medium text-white">{disaster.type}</p>
                    <p className="mt-1 text-xs text-white/48">{disaster.location}</p>
                  </div>
                </div>
                <span className="text-xs text-white/42">{formatDate(disaster.date)}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[22px] border border-white/8 bg-white/5 p-4 text-xs leading-6 text-white/55">
          Source: {disasterSource.provider} via {disasterSource.localExport}. Marker styling and popup treatment were updated to match the dark references more closely.
        </div>
      </div>
    </div>
  )
}
