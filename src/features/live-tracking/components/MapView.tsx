import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
  Circle
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { LatLngExpression } from "leaflet";
import type { LivePoint, Mandor } from "../types";

type Props = {
  points: LivePoint[];
  mandorLookup: Record<string, Mandor | undefined>;
};

const defaultCenter: LatLngExpression = [-4.83, 105.24]; // area GGP

// helper: buat ikon berdasarkan kondisi
function iconFor(p: LivePoint) {
  const isStale =
    p.updatedAt?.toDate
      ? Date.now() - p.updatedAt.toDate().getTime() > 5 * 60 * 1000 // > 5 menit
      : false;

  const url = isStale
    ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"
    : (p.batteryPct ?? 100) < 20
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";

  return L.icon({
    iconUrl: url,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Fit bounds ke semua marker
function FitBounds({ points }: { points: LivePoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    if(bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function MapView({ points, mandorLookup }: Props) {
  const center = useMemo<LatLngExpression>(() => {
    if (points.length) return [points[0].lat, points[0].lng];
    return defaultCenter;
  }, [points]);

  // URL untuk Tile Layers
  const GOOGLE_SAT = "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
  const ESRI_SAT = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        preferCanvas
      >
        <LayersControl position="topright">
          {/* Default layer sekarang adalah Google Satellite */}
          <LayersControl.BaseLayer checked name="Google Satellite (Clear)">
            <TileLayer 
              url={GOOGLE_SAT} 
              attribution="&copy; Google" 
              subdomains={['mt0','mt1','mt2','mt3']}
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="ESRI Satellite">
            <TileLayer url={ESRI_SAT} attribution="&copy; Esri" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer url={OSM} attribution="&copy; OpenStreetMap" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FitBounds points={points} />

        <MarkerClusterGroup chunkedLoading>
          {points.map((p) => {
            const m = mandorLookup[p.mandorId];
            const updatedText = p.updatedAt?.toDate
              ? p.updatedAt.toDate().toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit'})
              : "-";

            return (
              <Marker
                key={p.mandorId}
                position={[p.lat, p.lng]}
                icon={iconFor(p)}
                title={m?.name ?? p.mandorId}
              >
                <Popup minWidth={260}>
                  <div className="min-w-[240px]">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover border"
                        src={m?.avatarUrl || `https://ui-avatars.com/api/?name=${m?.name ?? 'M'}&background=random`}
                        alt={m?.name ?? 'Avatar'}
                      />
                      <div>
                        <div className="font-semibold">{m?.name ?? p.mandorId}</div>
                        <div className="text-xs opacity-70">PG: {p.pgId} • W: {p.wilayahId}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                      <div>Lokasi Terdekat: <span className="font-medium">{p.nearestLocCode ?? "-"}</span></div>
                      <div>Baterai: <span className="font-medium">{p.batteryPct ?? 0}%</span></div>
                      <div>Update: <span className="font-medium">{updatedText}</span></div>
                    </div>
                  </div>
                </Popup>

                {typeof p.accuracy === "number" && p.accuracy > 0 && (
                  <Circle
                    center={[p.lat, p.lng]}
                    radius={p.accuracy}
                    pathOptions={{ color: "#3b82f6", opacity: 0.4, fillOpacity: 0.1, weight: 1 }}
                  />
                )}
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
