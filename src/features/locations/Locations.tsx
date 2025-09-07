import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface LocationData {
  no: number;
  pg: string;
  wilayah: string;
  lokasi: string;
  luas: string;
}

interface LocationFilter {
  plantation_group: string;
  wilayah: string;
}

function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LocationFilter>({
    plantation_group: '',
    wilayah: ''
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        // Mock data matching the reference design
        const mockData: LocationData[] = [
          { no: 1, pg: 'PG1', wilayah: 'W01', lokasi: '001', luas: '6,79' },
          { no: 2, pg: 'PG1', wilayah: 'W01', lokasi: '002', luas: '9,19' },
          { no: 3, pg: 'PG1', wilayah: 'W01', lokasi: '003', luas: '7,00' },
          { no: 4, pg: 'PG1', wilayah: 'W01', lokasi: '004', luas: '13,98' },
          { no: 5, pg: 'PG1', wilayah: 'W01', lokasi: '005', luas: '3,34' }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setLocations(mockData);
          setFilteredLocations(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  const handleView = (location: LocationData) => {
    navigate(`/locations/${location.no}`);
  };

  const handleSearch = () => {
    let filtered = locations;
    
    if (filters.plantation_group) {
      filtered = filtered.filter(loc => loc.pg === filters.plantation_group);
    }
    
    if (filters.wilayah) {
      filtered = filtered.filter(loc => loc.wilayah === filters.wilayah);
    }
    
    setFilteredLocations(filtered);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plantation Group</label>
              <select
                value={filters.plantation_group}
                onChange={(e) => setFilters({...filters, plantation_group: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Pilih Plantation Group</option>
                <option value="PG 1">PG 1</option>
                <option value="PG 2">PG 2</option>
                <option value="PG 3">PG 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
              <select
                value={filters.wilayah}
                onChange={(e) => setFilters({...filters, wilayah: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Pilih Wilayah</option>
                <option value="W01">W01</option>
                <option value="W02">W02</option>
                <option value="W03">W03</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Locations Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Master Lokasi</h2>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Refresh
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead>
                <tr className="bg-primary-600">
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">PG</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Wilayah</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Luas (Ha)</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {filteredLocations.map((location) => (
                  <tr key={location.no} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.pg}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.wilayah}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.lokasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.luas}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleView(location)}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
                          title="Detail Lokasi"
                        >
                          <InformationCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleView(location)}
                          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
                          title="Lihat Peta"
                        >
                          <MapPinIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">1</span> hingga <span className="font-medium">{filteredLocations.length}</span> dari <span className="font-medium">{filteredLocations.length}</span> hasil
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Sebelumnya
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-primary-500 border border-primary-500">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Locations;
