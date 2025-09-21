// src/features/dashboard/components/LocationMap.tsx
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

export default function LocationMap() {
  // Mengatur pusat peta default ke area GGP sesuai permintaan
  const defaultCenter: LatLngExpression = [-4.83, 105.24];

  return (
    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="w-full h-full">
      <LayersControl position="topright">
        {/* Lapisan Satelit (Google) dijadikan default dengan `checked` */}
        <LayersControl.BaseLayer name="Satellite" checked>
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            attribution='&copy; Google Maps'
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Topographic">
           <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
}

