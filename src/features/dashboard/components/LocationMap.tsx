// src/features/dashboard/components/LocationMap.tsx
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocationMap() {
  return (
    <MapContainer center={[-4.826, 105.239]} zoom={11} className="h-full w-full">
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Street" checked>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
}
