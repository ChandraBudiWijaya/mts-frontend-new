import { MapContainer, TileLayer, LayersControl, Polyline, Marker, Popup } from "react-leaflet";
import type { TrackingPoint } from "../types";

export default function ReportMap({
  selected,
  track,
}: {
  selected: { mandorId: string; date: string } | null;
  track: TrackingPoint[];
}) {
  const center: [number, number] = track.length
    ? [track[0].lat, track[0].lng]
    : [-4.826, 105.239];

  const poly = track.map((p) => [p.lat, p.lng]) as [number, number][];

  return (
    <MapContainer center={center} zoom={14} className="h-full w-full">
      <LayersControl position="topright">
        {/* ✅ Default = Satellite */}
        <LayersControl.BaseLayer name="Satellite" checked>
          <TileLayer
            url="https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Earthstar Geographics'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Street">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Topo">
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {poly.length > 1 && (
        <Polyline positions={poly} weight={4} color="#2563eb" /> // biru
      )}

      {track.length > 0 && (
        <>
          <Marker position={poly[0]}>
            <Popup>
              Start: {new Date(track[0].timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
          <Marker position={poly[poly.length - 1]}>
            <Popup>
              End: {new Date(track.at(-1)!.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
