// src/features/dashboard/components/CoverageGrid.tsx
import { Card } from '@/components/ui';
import type { CoverageMandor } from '../types';

export default function CoverageGrid({ data }: { data: CoverageMandor[] }) {
  // Placeholder avatar, bisa diganti dengan gambar asli jika ada
  const getAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0f2fe&color=0c4a6e&bold=true`;
  
  return (
    <Card title="Total Coverage Location Per Mandor">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-6 p-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <img 
                src={getAvatarUrl(item.name)} 
                alt={item.name}
                className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md"
            />
            <p className="text-xs text-gray-700 truncate font-medium" title={item.name}>
              {item.name}
            </p>
            <p className="text-sm text-gray-900 font-bold">
              {parseFloat(item.total_coverage).toFixed(1)} km
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
