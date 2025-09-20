import { useEffect, useMemo, useRef, useState } from "react";
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
      ? Date.now() - p.updatedAt.toDate().getTime() > 5 * 60 * 1000
      : false;

  const url = isStale
    ? "/icons/pin-gray.svg"
    : (p.batteryPct ?? 100) < 20
      ? "/icons/pin-red.svg"
      : "/icons/pin-green.svg";

  return L.icon({
    iconUrl: url,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -28],
  });
}

// fit bounds ke semua marker
function FitBounds({ points }: { points: LivePoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export default function MapView({ points, mandorLookup }: Props) {
  // center awal: kalau ada point, pakai point pertama
  const center = useMemo<LatLngExpression>(() => {
    if (points.length) return [points[0].lat, points[0].lng];
    return defaultCenter;
  }, [points]);

  // Buat layer url (tanpa API key). Kamu bisa ganti ke MapTiler/Mapbox bila perlu.
  // Satellite: Esri World Imagery
  const ESRI_SAT = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  // Street: OpenStreetMap
  const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  // Topographic: ESRI World Topo
  const ESRI_TOPO = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="w-full h-[72vh] rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        preferCanvas
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer url={ESRI_SAT} attribution="&copy; Esri" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer url={OSM} attribution="&copy; OpenStreetMap" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic">
            <TileLayer url={ESRI_TOPO} attribution="&copy; Esri" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Fit ke semua marker saat data berubah */}
        <FitBounds points={points} />

        {/* Clustering */}
        <MarkerClusterGroup chunkedLoading>
          {points.map((p) => {
            const m = mandorLookup[p.mandorId];
            const updatedText = p.updatedAt?.toDate
              ? p.updatedAt.toDate().toLocaleString("id-ID")
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
                        className="w-12 h-12 rounded-full object-cover"
                        src={m?.avatarUrl || "/avatar.png"}
                      />
                      <div>
                        <div className="font-semibold">{m?.name ?? p.mandorId}</div>
                        <div className="text-xs opacity-70">PG: {p.pgId} • W: {p.wilayahId}</div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm space-y-1">
                      <div>Lokasi Terdekat: <span className="font-medium">{p.nearestLocCode ?? "-"}</span></div>
                      <div>Battery: <span className="font-medium">{p.batteryPct ?? 0}%</span></div>
                      <div>Last Update: <span className="font-medium">{updatedText}</span></div>
                    </div>
                  </div>
                </Popup>

                {/* Cincin akurasi (opsional) */}
                {typeof p.accuracy === "number" && p.accuracy > 0 && (
                  <Circle
                    center={[p.lat, p.lng]}
                    radius={p.accuracy}
                    pathOptions={{ color: "#3b82f6", opacity: 0.4, fillOpacity: 0.1 }}
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
