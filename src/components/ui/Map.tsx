import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  geofence?: {
    lat: number;
    lng: number;
  }[];
  height?: string;
}

function Map({ center, geofence, height = 'h-96' }: MapProps) {
  const mapStyle = {
    height: height === 'h-96' ? '400px' : height.replace('h-', '').replace('px', '') + 'px',
    width: '100%'
  };

  // Convert geofence points to Leaflet format
  const polygonPositions: [number, number][] = geofence 
    ? geofence.map(point => [point.lat, point.lng] as [number, number])
    : [];

  const polygonOptions = {
    color: '#f59e0b', // Orange color
    weight: 3,
    opacity: 0.8,
    fillColor: '#fbbf24',
    fillOpacity: 0.4,
  };

  return (
    <div className="relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={16}
        style={mapStyle}
        className="rounded-lg"
      >
        {/* Satellite tile layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        />
        
        {/* Street overlay for labels */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.5}
        />

        {/* Center marker */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <div>
              <strong>Location Center</strong><br />
              Lat: {center.lat.toFixed(6)}<br />
              Lng: {center.lng.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        {/* Geofence polygon */}
        {polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={polygonOptions}
          >
            <Popup>
              <div>
                <strong>Geofence Area</strong><br />
                Points: {polygonPositions.length}
              </div>
            </Popup>
          </Polygon>
        )}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-[1000]">
        <div className="space-y-2">
          <div className="text-xs text-gray-600">
            <strong>Tipe Peta:</strong> Satellite
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 border border-orange-600 rounded"></div>
            <span className="text-xs text-gray-600">Geofence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
