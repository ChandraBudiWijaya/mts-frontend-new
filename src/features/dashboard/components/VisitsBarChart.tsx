// src/features/dashboard/components/VisitsBarChart.tsx
import { Card } from '@/components/ui';
import type { KunjunganWilayah } from '../types';

export default function VisitsBarChart({ data }: { data: KunjunganWilayah[] }) {
  const maxValue = Math.max(...data.map(item => item.total_kunjungan), 0);
  const scale = maxValue > 0 ? 100 / maxValue : 0; // Skala persentase untuk tinggi bar

  return (
    <Card title="Total Kunjungan Lokasi Per Wilayah">
      <div className="h-80 p-6">
        <div className="relative h-full flex items-end justify-around gap-2">
          {/* Garis Sumbu Y */}
          <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
          {/* Label Sumbu Y */}
          {[...Array(5)].map((_, i) => (
             <div key={i} className="absolute left-[-2.5rem] text-xs text-gray-500" style={{ bottom: `${(i/4)*100}%`}}>
                {Math.round((i/4)*maxValue)}
             </div>
          ))}

          {data.map((item) => (
            <div key={item.region} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-4/5 bg-primary-600 rounded-t-sm hover:bg-primary-700 transition-colors"
                style={{ height: `${item.total_kunjungan * scale}%` }}
                title={`${item.region}: ${item.total_kunjungan} kunjungan`}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{item.region}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
