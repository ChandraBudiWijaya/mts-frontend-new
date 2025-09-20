import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../shared/api';
import { format, subDays } from 'date-fns';
import type { DashboardStats } from '../../shared/types';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import MapView from './components/MapView';
import { 
  UsersIcon, 
  MapPinIcon, 
  ClockIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats(dateRange);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);

  const totalActiveUsers = stats?.totalUserAktif?.reduce((sum, item) => sum + item.total, 0) || 0;
  const totalLocationsVisited = stats?.totalLokasiTerkunjungi?.reduce((sum, item) => sum + item.total, 0) || 0;
  const totalCoverage = stats?.coveragePerMandor?.reduce((sum, item) => sum + parseFloat(item.total_coverage), 0) || 0;
  const totalVisits = stats?.kunjunganPerWilayah?.reduce((sum, item) => sum + item.total_kunjungan, 0) || 0;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
            <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
              <option>All</option>
              <option>PG1</option>
              <option>PG2</option>
              <option>PG3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
            <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
              <option>All</option>
              <option>W1</option>
              <option>W2</option>
              <option>W3</option>
            </select>
          </div>
          <div className="md:text-right">
            <button className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-colors">Search</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Users"
          value={totalActiveUsers}
          icon={UsersIcon}
          color="green"
          loading={loading}
          trend={{
            value: 12,
            label: 'vs last week',
            type: 'up'
          }}
        />
        <StatCard
          title="Locations Visited"
          value={totalLocationsVisited}
          icon={MapPinIcon}
          color="green"
          loading={loading}
          trend={{
            value: 8,
            label: 'vs last week',
            type: 'up'
          }}
        />
        <StatCard
          title="Total Coverage"
          value={`${totalCoverage.toFixed(1)} km`}
          icon={TruckIcon}
          color="green"
          loading={loading}
          trend={{
            value: 5,
            label: 'vs last week',
            type: 'up'
          }}
        />
        <StatCard
          title="Total Visits"
          value={totalVisits}
          icon={ClockIcon}
          color="green"
          loading={loading}
          trend={{
            value: -2,
            label: 'vs last week',
            type: 'down'
          }}
        />
      </div>

      {/* Map and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Component - Full Width */}
        <div className="lg:col-span-2">
          <Card
            title="Lokasi"
            subtitle=""
          >
            <div className='h-[500px]'>
              <MapView />
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total User Aktif Chart */}
        <Card
          title="Total User Aktif"
          subtitle=""
        >
          <div className="flex items-center justify-center h-64 p-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
            ) : (
              <div className="relative w-48 h-48">
                {/* Donut Chart */}
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* PG 1 - Dark Green */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#1e8e3e"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="120 283"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* PG 2 - Teal */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#14b8a6"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="80 283"
                    strokeDashoffset="-120"
                    strokeLinecap="round"
                  />
                  {/* PG 3 - Orange */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#f97316"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="63 283"
                    strokeDashoffset="-200"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{totalActiveUsers}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-3 px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary-600 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 1</span>
              </div>
              <span className="font-medium text-gray-900">42%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-teal-500 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 2</span>
              </div>
              <span className="font-medium text-gray-900">28%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 3</span>
              </div>
              <span className="font-medium text-gray-900">22%</span>
            </div>
          </div>
        </Card>

        {/* Total Lokasi Terkunjungi Chart */}
        <Card
          title="Total Lokasi Terkunjungi"
          subtitle=""
        >
          <div className="flex items-center justify-center h-64 p-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
            ) : (
              <div className="relative w-48 h-48">
                {/* Donut Chart */}
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Active - Dark Green */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#1e8e3e"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="140 283"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Inactive - Teal */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#14b8a6"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="90 283"
                    strokeDashoffset="-140"
                    strokeLinecap="round"
                  />
                  {/* PG 3 - Orange */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#f97316"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="53 283"
                    strokeDashoffset="-230"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{totalLocationsVisited}</div>
                    <div className="text-sm text-gray-600">Locations</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-3 px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary-600 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 1</span>
              </div>
              <span className="font-medium text-gray-900">49%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-teal-500 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 2</span>
              </div>
              <span className="font-medium text-gray-900">32%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">PG 3</span>
              </div>
              <span className="font-medium text-gray-900">19%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bar Chart Section */}
      <Card
        title="Total Kunjungan Lokasi Per Wilayah"
        subtitle=""
      >
        {loading ? (
          <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
        ) : (
          <div className="h-80 p-6">
            {/* Chart area with grid */}
            <div className="relative h-full">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
                <span>160</span>
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-8 top-4 right-4 bottom-8 border-l border-b border-gray-200">
                <div className="relative h-full">
                  {[0, 25, 50, 75].map((percentage) => (
                    <div
                      key={percentage}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${percentage}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Bars */}
              <div className="absolute left-8 top-4 right-4 bottom-8 flex items-end justify-between">
                {/* Sample data for demonstration */}
                {[
                  { name: 'Jan', value: 120 },
                  { name: 'Feb', value: 95 },
                  { name: 'Mar', value: 140 },
                  { name: 'Apr', value: 110 },
                  { name: 'May', value: 155 },
                  { name: 'Jun', value: 125 },
                  { name: 'Jul', value: 90 },
                  { name: 'Aug', value: 130 },
                  { name: 'Sep', value: 145 },
                  { name: 'Oct', value: 100 },
                  { name: 'Nov', value: 115 },
                  { name: 'Dec', value: 135 },
                  { name: 'Jan', value: 120 },
                  { name: 'Feb', value: 95 },
                  { name: 'Mar', value: 75 },
                  { name: 'Apr', value: 105 },
                  { name: 'May', value: 85 },
                  { name: 'Jun', value: 95 },
                  { name: 'Jul', value: 110 },
                  { name: 'Aug', value: 125 },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div
                        className="w-6 bg-primary-600 rounded-t-sm transition-all duration-1000 ease-out"
                        style={{
                          height: `${(item.value / 160) * 240}px`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute left-8 right-4 bottom-0 flex justify-between text-xs text-gray-500">
                {[
                  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
                  'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20'
                ].map((label) => (
                  <span key={label} className="text-center">{label}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Coverage Per Mandor Grid */}
      <Card
        title="Total Coverage Location Per Mandor"
        subtitle=""
      >
        {loading ? (
          <div className="grid grid-cols-9 gap-4 p-4">
            {[...Array(27)].map((_, i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-9 gap-4 p-4">
            {/* Generate 27 mandor items to match the reference */}
            {[...Array(27)].map((_, index) => {
              const mandorNames = [
                'Purnain EJ', 'Sumarto', 'Zaenudin', 'Ibrohim', 'Rohidin', 'Sunarto', 'Zuhrul DI',
                'Zainul DI', 'Karimin SJ', 'Sukatno SJ', 'Wahidin DI', 'Kasmuri SJ', 'Kasmat F4',
                'Anton', 'Sutanto F4', 'Harun EJ', 'Mispan EJ', 'Mustafa', 'Jarkoni F4',
                'Karijan F4', 'Sukardi F4', 'Miswan EJ', 'Wasoto DI', 'Muhidin DI', 'Zaenudin DI',
                'Rosyim DI', 'Slamet'
              ];
              
              const name = mandorNames[index] || `Mandor ${index + 1}`;
              const coverage = Math.floor(Math.random() * 30) + 70; // Random coverage between 70-100
              
              return (
                <div key={index} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    {/* Circular progress background */}
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#1e8e3e"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${(coverage / 100) * 176} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800">10</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name */}
                  <p className="text-xs text-gray-700 truncate font-medium" title={name}>
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Legacy Charts - Hidden */}
      <div className="hidden">
        {/* Active Users by PG Chart */}
        <Card
          title="Active Users by Plantation Group"
          subtitle="Employee activity breakdown"
        >
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.totalUserAktif?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.plantation_group}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${stats.totalUserAktif ? (item.total / Math.max(...stats.totalUserAktif.map(x => x.total))) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium min-w-[2rem] text-right">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Coverage by Mandor Chart */}
        <Card
          title="Top Performers by Coverage"
          subtitle="Coverage distance leaders"
        >
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.coveragePerMandor?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-4">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${stats.coveragePerMandor ? (parseFloat(item.total_coverage) / Math.max(...stats.coveragePerMandor.map(x => parseFloat(x.total_coverage)))) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium min-w-[3rem] text-right">
                      {parseFloat(item.total_coverage).toFixed(1)} km
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Legacy Visits by Region - Hidden */}
      <div className="hidden">
        <Card
          title="Visits by Region"
          subtitle="Regional activity overview"
        >
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse text-center p-4 bg-gray-50 rounded-lg">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.kunjunganPerWilayah?.map((item, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-300 border border-primary-200">
                <p className="text-3xl font-bold text-primary-600">{item.total_kunjungan}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">{item.region}</p>
              </div>
            ))}
          </div>
        )}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
