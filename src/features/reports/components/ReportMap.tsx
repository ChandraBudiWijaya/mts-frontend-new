// src/features/reports/components/ReportMap.tsx
import { MapContainer, TileLayer, LayersControl, Polyline, Marker, Popup, useMap } from "react-leaflet";
import type { TrackingPoint } from "../types";
import { useEffect } from "react";
import L from 'leaflet';

// Komponen helper untuk otomatis fit bounds peta
function FitBounds({ polylines }: { polylines: TrackingPoint[][] }) {
    const map = useMap();
    useEffect(() => {
        if (!polylines || polylines.length === 0 || polylines.flat().length === 0) {
            map.setView([-4.826, 105.239], 12); // Default view jika tidak ada data
            return;
        };

        const allPoints = polylines.flat().map(p => [p.lat, p.lng] as [number, number]);
        if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [polylines, map]);
    return null;
}

export default function ReportMap({
  polylines = [], // <-- TAMBAHKAN INI: Memberikan nilai default array kosong
}: {
  polylines: TrackingPoint[][];
}) {
  // Warna-warni untuk setiap segmen rute
  const routeColors = ['#3b82f6', '#ef4444', '#10b981', '#f97316', '#8b5cf6', '#eab308', '#d946ef'];

  return (
    <MapContainer center={[-4.826, 105.239]} zoom={12} className="h-full w-full">
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Street" checked>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} attribution='&copy; Google'/>
        </LayersControl.BaseLayer>
      </LayersControl>

      <FitBounds polylines={polylines} />

      {polylines.map((segment, index) => {
        if (segment.length < 2) return null;
        const positions = segment.map((p) => [p.lat, p.lng]) as [number, number][];
        // Jika hanya ada satu polyline (rute utuh), gunakan warna biru. Jika banyak, gunakan warna-warni.
        const color = polylines.length === 1 ? '#3b82f6' : routeColors[index % routeColors.length];

        return (
            <Polyline key={index} positions={positions} weight={5} color={color} opacity={0.8}>
                <Popup>Rute Lokasi Kunjungan</Popup>
            </Polyline>
        );
      })}
    </MapContainer>
  );
}
