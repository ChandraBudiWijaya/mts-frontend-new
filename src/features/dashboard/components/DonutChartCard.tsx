// src/features/dashboard/components/DonutChartCard.tsx
import { Card, LoadingSpinner } from '@/components/ui';
import type { DataPoint } from '../types';

interface DonutChartCardProps {
  title: string;
  data: DataPoint[];
  loading: boolean;
  dataKey: string;
  valueKey: string;
}

const colors = ['#1e8e3e', '#14b8a6', '#f97316', '#8b5cf6', '#d946ef'];

export default function DonutChartCard({ title, data, loading, dataKey, valueKey }: DonutChartCardProps) {
  const totalValue = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
  let accumulatedPercentage = 0;

  return (
    <Card title={title}>
      {loading ? (
        <div className="flex justify-center items-center h-80"><LoadingSpinner /></div>
      ) : (
        <>
          <div className="flex items-center justify-center h-64 p-4">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" stroke="#e5e7eb" strokeWidth="15" fill="transparent" />
                {data.map((item, index) => {
                  const percentage = totalValue > 0 ? (item[valueKey] / totalValue) * 100 : 0;
                  const strokeDasharray = `${(percentage / 100) * 283} 283`;
                  const strokeDashoffset = -((accumulatedPercentage / 100) * 283);
                  accumulatedPercentage += percentage;
                  return (
                    <circle key={item[dataKey]} cx="60" cy="60" r="45" stroke={colors[index % colors.length]} strokeWidth="15" fill="transparent"
                      strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{totalValue}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3 px-4">
            {data.map((item, index) => (
              <div key={item[dataKey]} className="flex items-center justify-between text-sm">
                <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <span className="text-gray-700">{item[dataKey]}</span>
                </div>
                <span className="font-medium text-gray-900">{item[valueKey]}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

