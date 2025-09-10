import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CenteredLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'gray';
  message?: string;
}

const CenteredLoadingSpinner: React.FC<CenteredLoadingSpinnerProps> = ({ 
  size = 'lg', 
  color = 'primary',
  message = 'Loading...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size={size} color={color} />
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default CenteredLoadingSpinner;
