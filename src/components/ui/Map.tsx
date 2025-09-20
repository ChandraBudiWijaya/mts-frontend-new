import { useState, useMemo } from 'react';
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
  // initial base layer key: 'satellite' | 'street' | 'topo'
  initialLayer?: 'satellite' | 'street' | 'topo';
}

function Map({ center, geofence, height = 'h-96', initialLayer = 'satellite' }: MapProps) {
  const [selectedLayer, setSelectedLayer] = useState<'satellite' | 'street' | 'topo'>(initialLayer);

  const mapStyle = useMemo(() => {
    // simple mapping for common tailwind height tokens, fallback to 400px
    if (height === 'h-96') return { height: '400px', width: '100%' };
    // fallback: let CSS handle sizing, but provide a reasonable default
    return { height: '400px', width: '100%' };
  }, [height]);

  

  const baseLayers: Record<
    'satellite' | 'street' | 'topo',
    { url: string; attribution?: string; maxZoom?: number }
  > = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      maxZoom: 19,
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap contributors',
      maxZoom: 17,
    },
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
        {/* Base layer: chosen by user */}
        <TileLayer
          key={selectedLayer}
          url={baseLayers[selectedLayer].url}
          attribution={baseLayers[selectedLayer].attribution}
        />

        {/* Center marker */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <div>
              <strong>Location Center</strong>
              <br />
              Lat: {center.lat.toFixed(6)}
              <br />
              Lng: {center.lng.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        {/* Geofence polygon */}
        {polygonPositions.length > 0 && (
          <Polygon positions={polygonPositions} pathOptions={polygonOptions}>
            <Popup>
              <div>
                <strong>Geofence Area</strong>
                <br />
                Points: {polygonPositions.length}
              </div>
            </Popup>
          </Polygon>
        )}
      </MapContainer>

      {/* Map controls overlay: layer selector */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-[1000]">
        <div className="text-xs text-gray-700 font-medium mb-2">Tipe Peta</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedLayer('satellite')}
            className={`px-2 py-1 text-xs rounded ${selectedLayer === 'satellite' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}
            aria-pressed={selectedLayer === 'satellite'}
          >
            Satellite
          </button>
          <button
            onClick={() => setSelectedLayer('street')}
            className={`px-2 py-1 text-xs rounded ${selectedLayer === 'street' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}
            aria-pressed={selectedLayer === 'street'}
          >
            Street
          </button>
          <button
            onClick={() => setSelectedLayer('topo')}
            className={`px-2 py-1 text-xs rounded ${selectedLayer === 'topo' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}
            aria-pressed={selectedLayer === 'topo'}
          >
            Topo
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 border border-orange-600 rounded" />
            <span>Geofence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
