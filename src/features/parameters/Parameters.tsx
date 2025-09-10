/**
 * Parameter Management Page
 * 
 * Halaman untuk mengelola parameter aplikasi MTS (Mandor Tracking System).
 * Fitur yang tersedia:
 * - Menampilkan daftar parameter dengan pagination
 * - Filter berdasarkan group dan status
 * - Pencarian parameter berdasarkan key
 * - Edit parameter value, description, dan status
 * - Test mobile settings API
 * 
 * @author Chandra Budi Wijaya
 * @version 1.0.0
 * @created 2025-09-10
 * @lastModified 2025-09-10
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  PencilIcon,
  XMarkIcon,
  CogIcon 
} from '@heroicons/react/24/outline';
import { Card, Button, Input, LoadingSpinner, Alert } from '../../components/ui';
import { parametersAPI } from '../../shared/api';
import type { Parameter, ParameterFormData, ParameterFilters } from './types';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * Komponen utama halaman Parameter Management
 * 
 * Menampilkan tabel parameter dengan fitur filter, search, dan edit.
 * Menggunakan debounced search untuk optimasi performa.
 * 
 * @returns {JSX.Element} Komponen Parameter Management
 */
const Parameters: React.FC = () => {
  // === State Management ===
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<ParameterFilters>({
    group: '',
    status: '',
    search: ''
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState<ParameterFormData>({
    param_value: '',
    description: '',
    status: true
  });
  
  // Search debounce timeout
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // === API Functions ===

  /**
   * Load parameter groups dari API
   * Menampilkan notifikasi sukses/error setelah loading
   */
  const loadGroups = useCallback(async () => {
    try {
      setLoadingGroups(true);
      setError(null);
      const response = await parametersAPI.getGroups();
      setGroups(response.data || []);
      setSuccess('Groups loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error loading groups'));
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  /**
   * Load parameters dengan filter yang diterapkan
   * Menggunakan filter state untuk query parameters
   */
  const loadParameters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, unknown> = {};
      if (filters.group) params.group = filters.group;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      
      const response = await parametersAPI.getAll(params);
      setParameters(response.data || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error loading parameters'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // === Event Handlers ===

  /**
   * Handle perubahan search input dengan debouncing
   * Menunggu 500ms setelah user berhenti mengetik sebelum search
   * 
   * @param value - nilai search input
   */
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      loadParameters();
    }, 500);
    
    setSearchTimeout(timeout);
  };

  /**
   * Handle perubahan filter (group/status)
   * 
   * @param key - key filter yang diubah
   * @param value - nilai baru filter
   */
  const handleFilterChange = (key: keyof ParameterFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Handle edit parameter - load data parameter dan buka modal
   * 
   * @param parameterId - ID parameter yang akan diedit
   */
  const editParameter = async (parameterId: number) => {
    try {
      setError(null);
      const response = await parametersAPI.getById(parameterId);
      const param = response.data;
      
      setEditingParameter(param);
      setFormData({
        param_value: param.param_value,
        description: param.description || '',
        status: param.status
      });
      setShowModal(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error loading parameter'));
    }
  };

  /**
   * Handle submit form update parameter
   * 
   * @param e - form event
   */
  const updateParameter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingParameter) return;
    
    try {
      setError(null);
      await parametersAPI.update(editingParameter.id, { ...formData } as Record<string, unknown>);
      
      setShowModal(false);
      setEditingParameter(null);
      setSuccess('Parameter updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      loadParameters();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error updating parameter'));
    }
  };

  /**
   * Close modal dan reset form data
   */
  const closeModal = () => {
    setShowModal(false);
    setEditingParameter(null);
    setFormData({
      param_value: '',
      description: '',
      status: true
    });
  };

  /**
   * Test mobile settings API endpoint
   * Menampilkan hasil di console browser
   */
  const testMobileSettings = async () => {
    try {
      setError(null);
      const response = await parametersAPI.getMobileSettings();
      console.log('Mobile Settings:', response.data);
      setSuccess('Mobile settings test successful! Check console for details.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error testing mobile settings'));
    }
  };

  // === Effects ===

  /**
   * Initial data loading saat komponen mount
   */
  useEffect(() => {
    loadGroups();
    loadParameters();
  }, [loadGroups, loadParameters]);

  /**
   * Cleanup search timeout saat komponen unmount
   */
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // === Render ===

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CogIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Parameter Management</h1>
        </div>
        <Button
          onClick={loadGroups}
          disabled={loadingGroups}
          className="flex items-center gap-2"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loadingGroups ? 'animate-spin' : ''}`} />
          Refresh Groups
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Card>
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Filter:
              </label>
              <select
                value={filters.group}
                onChange={(e) => handleFilterChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Groups</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter:
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search:
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search parameters..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={loadParameters}
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                Load Parameters
              </Button>
            </div>
          </div>

          {/* Parameters Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
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
                  {parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {param.param_key}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="truncate" title={param.param_value}>
                          {param.param_value}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {param.group_name || 'No Group'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          param.status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {param.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editParameter(param.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {parameters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No parameters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Mobile Settings Test */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mobile Settings Test</h2>
          <p className="text-gray-600 mb-4">
            Test endpoint untuk mobile settings API. Hasil akan ditampilkan di console browser.
          </p>
          <Button
            onClick={testMobileSettings}
            className="bg-green-500 hover:bg-green-600"
          >
            Test Mobile Settings API
          </Button>
        </div>
      </Card>

      {/* Edit Parameter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Parameter</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={updateParameter}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parameter Key:
                </label>
                <Input
                  type="text"
                  value={editingParameter?.param_key || ''}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value: <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.param_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, param_value: e.target.value }))}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description:
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status: <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Update Parameter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parameters;
