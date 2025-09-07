import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: {
    value: number;
    label: string;
    type: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  loading = false,
}: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      trend: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      trend: 'text-green-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      trend: 'text-purple-600',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      trend: 'text-orange-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      trend: 'text-red-600',
    },
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color].bg}`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].text}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trendColors[trend.type]}`}>
                {trend.type === 'up' && '↗ '}
                {trend.type === 'down' && '↘ '}
                {trend.value > 0 && trend.type !== 'down' && '+'}
                {trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
