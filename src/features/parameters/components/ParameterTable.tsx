/**
 * Parameter Table Component
 * 
 * Displays parameters in a tabular format with edit functionality.
 * Includes status badges, truncated values with tooltips, and loading states.
 */

import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../../components/ui';
import type { Parameter } from '../types';

interface ParameterTableProps {
  parameters: Parameter[];
  loading: boolean;
  onEditParameter: (parameterId: number) => void;
}

const ParameterTable: React.FC<ParameterTableProps> = ({
  parameters,
  loading,
  onEditParameter,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parameter Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Group
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parameters.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No parameters found
              </td>
            </tr>
          ) : (
            parameters.map((param) => (
              <tr key={param.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {param.param_key}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div
                    className="truncate cursor-help"
                    title={param.param_value}
                  >
                    {param.param_value}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {param.group_name || 'No Group'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      param.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {param.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEditParameter(param.id)}
                    className="text-primary-600 hover:text-primary-900 flex items-center gap-1 transition-colors"
                    title={`Edit ${param.param_key}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParameterTable;
