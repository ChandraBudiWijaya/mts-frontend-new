import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Map from '../../components/ui/Map';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { geofenceAPI } from '../../shared/api';

interface LatLng { lat: number; lng: number }
// removed unused CoordinatesRaw

type Meta = {
  pg_group?: string;
  region?: string;
  location_code?: string;
  area_size?: number | string;
  name?: string;
} | null;

const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null;

const hasData = <T,>(val: unknown): val is { data: T } =>
  isObject(val) && 'data' in val;

const isTruthy = <T,>(v: T | null | undefined | false): v is T => Boolean(v);

function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [center, setCenter] = useState<LatLng | null>(null);
  const [polygon, setPolygon] = useState<LatLng[]>([]);
  const [meta, setMeta] = useState<Meta>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toNumber = (v: unknown): number | null => {
    const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
    return Number.isFinite(n) ? n : null;
  };

  const normalizeCoordinates = (raw: unknown): LatLng[] => {
    try {
      let data: unknown = raw;
      if (typeof data === 'string') {
        // Attempt JSON parse, fallback to comma-separated "lng, lat, lng, lat, ..."
        try {
          data = JSON.parse(data);
        } catch {
          const s = String(data);
          const parts = s.split(',').map((x: string) => parseFloat(x.trim())).filter((n: number) => Number.isFinite(n));
          const pts: LatLng[] = [];
          for (let i = 0; i < parts.length; i += 2) {
            const lng = parts[i];
            const lat = parts[i + 1];
            if (Number.isFinite(lat) && Number.isFinite(lng)) pts.push({ lat, lng });
          }
          return pts;
        }
      }

      if (Array.isArray(data)) {
        if (data.length > 0 && Array.isArray(data[0]) && (data[0] as unknown[]).length >= 2) {
          // [[lng, lat], ...] or [[lat, lng], ...]
          return (data as unknown[])
            .map((p): LatLng | null => {
              if (!Array.isArray(p) || p.length < 2) return null;
              const a = toNumber(p[0]);
              const b = toNumber(p[1]);
              if (a == null || b == null) return null;
              const isLngFirst = Math.abs(a) > 1 && Math.abs(a) >= Math.abs(b);
              const lng = isLngFirst ? a : b;
              const lat = isLngFirst ? b : a;
              return { lat, lng };
            })
            .filter(isTruthy);
        }
        if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
          return (data as unknown[])
            .map((p): LatLng | null => {
              if (!isObject(p)) return null;
              const lat = toNumber((p as Record<string, unknown>).lat ?? (p as Record<string, unknown>).latitude);
              const lng = toNumber((p as Record<string, unknown>).lng ?? (p as Record<string, unknown>).longitude ?? (p as Record<string, unknown>).long);
              if (lat == null || lng == null) return null;
              return { lat, lng };
            })
            .filter(isTruthy);
        }
      }
    } catch (e) {
      console.error('Failed to normalize coordinates:', e);
    }
    return [];
  };

  const computeCenter = (points: LatLng[]): LatLng | null => {
    if (!points || points.length === 0) return null;
    let sumLat = 0, sumLng = 0;
    points.forEach(p => { sumLat += p.lat; sumLng += p.lng; });
    return { lat: sumLat / points.length, lng: sumLng / points.length };
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const res = await geofenceAPI.getById(parseInt(id, 10));
        const payload: unknown = res.data as unknown;
        const recordUnknown: unknown = hasData(payload) ? payload.data : payload;

        let nextMeta: Meta = null;
        let coordsRaw: unknown = undefined;
        if (isObject(recordUnknown)) {
          const rec = recordUnknown as Record<string, unknown>;
          nextMeta = {
            pg_group: typeof rec.pg_group === 'string' ? rec.pg_group : undefined,
            region: typeof rec.region === 'string' ? rec.region : undefined,
            location_code: typeof rec.location_code === 'string' ? rec.location_code : undefined,
            area_size:
              typeof rec.area_size === 'number' || typeof rec.area_size === 'string'
                ? rec.area_size
                : undefined,
            name: typeof rec.name === 'string' ? rec.name : undefined,
          };
          coordsRaw = rec.coordinates;
        }

        setMeta(nextMeta);
        const coords = normalizeCoordinates(coordsRaw);
        setPolygon(coords);
        const c = computeCenter(coords) || { lat: -4.826, lng: 105.239 };
        setCenter(c);
      } catch (e) {
        console.error('Error fetching geofence detail:', e);
        setError('Gagal memuat detail lokasi');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-6"><Alert variant="error">{error}</Alert></div>;
  if (!center) return <div className="text-center py-12 text-gray-500">Data tidak tersedia</div>;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Back to list */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate('/locations')}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="text-sm text-gray-700">Kembali ke List</div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Detail Lokasi</h2>
        <p className="text-gray-600">
          {(meta?.pg_group || '-') + ' | ' + (meta?.region || '-') + ' | ' + (meta?.location_code || meta?.name || '-') + ' | '} 
          {`Luas ${typeof meta?.area_size === 'number' ? (meta?.area_size as number).toFixed(2) : (meta?.area_size ?? '-') } Ha`}
        </p>
      </div>

      {/* Peta Geofence */}
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <MapPinIcon className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Peta Geofence</h2>
          </div>
          <div id="map">
            <Map center={center} geofence={polygon} height="h-96" />
          </div>
        </div>
      </Card>

      {/* Tabel Koordinat Geofence */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Detail Koordinat Geofence</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-primary-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Latitude</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Longitude</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {polygon.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.lat.toLocaleString('id-ID', { minimumFractionDigits: 7, useGrouping: false })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.lng.toLocaleString('id-ID', { minimumFractionDigits: 7, useGrouping: false })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LocationDetail;
