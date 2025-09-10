import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { L: any }
}

type Props = {
  center?: [number, number]
  polygon?: [number, number][]
}

export default function LocationMap({ center = [-5.4, 105.3], polygon }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState<'sat' | 'street' | 'topo'>('sat')

  useEffect(() => {
    const L = window.L
    if (!L || !mapRef.current) return

    const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 14)

    const layers = {
      sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri World Imagery',
      }),
      street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }),
      topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; OpenTopoMap',
      }),
    }

    layers[active].addTo(map)

    const zoom = L.control.zoom({ position: 'bottomright' }).addTo(map)

    let poly: any | undefined
    if (polygon && polygon.length) {
      poly = L.polygon(polygon, { color: '#1e8e3e', fillColor: '#f59e0b', fillOpacity: 0.45, weight: 2 }).addTo(map)
      map.fitBounds(poly.getBounds(), { padding: [20, 20] })
    }

    return () => {
      map.removeControl(zoom)
      if (poly) poly.remove()
      map.remove()
    }
  }, [])

  // Change base layer when active changes is handled by key on wrapper

  return (
    <div className="relative">
      <div key={active} ref={mapRef} className="w-full h-[480px] rounded-2xl overflow-hidden" />
      <div className="absolute top-4 right-4 bg-white rounded-md shadow p-2 min-w-[160px]">
        <div className="text-xs font-medium text-gray-700 mb-2">Tipe Peta</div>
        <div className="space-y-1">
          <button onClick={() => setActive('sat')} className={`w-full text-left px-2 py-1 rounded ${active==='sat' ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'}`}>Satellite</button>
          <button onClick={() => setActive('street')} className={`w-full text-left px-2 py-1 rounded ${active==='street' ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'}`}>Street Map</button>
          <button onClick={() => setActive('topo')} className={`w-full text-left px-2 py-1 rounded ${active==='topo' ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'}`}>Topographic</button>
        </div>
      </div>
    </div>
  )
}
