import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Map from '../../components/ui/Map';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface LocationDetailType {
  no: number;
  pg: string;
  wilayah: string;
  lokasi: string;
  luas: string;
  coordinates: { lat: number; lng: number };
  geofence: { lat: number; lng: number }[];
}

function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);

        const locationCoords = {
          1: { lat: -7.384746, lng: 105.0303443 },
          2: { lat: -7.384745, lng: 105.0303443 },
          3: { lat: -7.384746, lng: 105.0303443 },
          4: { lat: -7.384746, lng: 105.0303443 },
          5: { lat: -7.384746, lng: 105.0303443 },
        } as const;

        const current = locationCoords[(parseInt(id, 10) as 1 | 2 | 3 | 4 | 5) || 1];

        const mockDetail: LocationDetailType = {
          no: parseInt(id, 10),
          pg: 'PG 1',
          wilayah: 'W01',
          lokasi: `00${id}`,
          luas: id === '1' ? '6,79' : id === '2' ? '9,19' : id === '3' ? '7,00' : id === '4' ? '13,98' : '3,34',
          coordinates: current,
          geofence: [
            { lat: current.lat - 0.00005, lng: current.lng - 0.00005 },
            { lat: current.lat - 0.00005, lng: current.lng + 0.00005 },
            { lat: current.lat + 0.00005, lng: current.lng + 0.00005 },
            { lat: current.lat + 0.00005, lng: current.lng - 0.00005 },
            { lat: current.lat - 0.00005, lng: current.lng - 0.00005 },
          ],
        };

        setTimeout(() => {
          setLocation(mockDetail);
          setLoading(false);
        }, 400);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchLocationDetail();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!location) return <div className="text-center py-12 text-gray-500">Location not found</div>;

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
          {location.pg} • {location.wilayah} • {location.lokasi} • Luas {location.luas} Ha
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
            <Map center={location.coordinates} geofence={location.geofence} height="h-96" />
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
                {location.geofence.map((p, idx) => (
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

