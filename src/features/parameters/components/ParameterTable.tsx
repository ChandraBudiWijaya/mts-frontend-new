import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../../components/ui';
import type { Parameter } from '../types';

interface ParameterTableProps {
  parameters: Parameter[];
  loading: boolean;
  onEdit: (parameter: Parameter) => void;
  onDelete: (parameter: Parameter) => void;
}

const ParameterTable: React.FC<ParameterTableProps> = ({ parameters, loading, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter Key</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex justify-center items-center gap-2 text-gray-500">
                  <LoadingSpinner />
                  <span>Memuat data parameter...</span>
                </div>
              </td>
            </tr>
          ) : parameters.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                Tidak ada parameter yang ditemukan.
              </td>
            </tr>
          ) : (
            parameters.map((param) => (
              <tr key={param.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{param.param_key}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <div className="truncate" title={param.param_value}>{param.param_value}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {param.group_name || "No Group"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${param.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {param.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-3">
                    <button onClick={() => onEdit(param)} className="text-green-700 hover:text-green-900 flex items-center gap-1">
                      <PencilIcon className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => onDelete(param)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                      <TrashIcon className="h-4 w-4" /> Delete
                    </button>
                  </div>
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
