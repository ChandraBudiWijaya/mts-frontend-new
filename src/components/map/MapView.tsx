import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    L: any
  }
}

export default function MapView() {
  const mapEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const L = window.L
    if (!mapEl.current || !L) return

    const map = L.map(mapEl.current, { zoomControl: false }).setView([-2.5, 118], 5)

    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, AEX, GeoEye, Earthstar, etc.',
      },
    )

    L.control.layers({ Street: street, Satellite: satellite }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    return () => map.remove()
  }, [])

  return (
    <div className="flex w-full h-80 md:h-full rounded-lg overflow-hidden border">
      <div ref={mapEl} className="w-full h-full" />
    </div>
  )
}

