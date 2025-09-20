// features/parameters/components/FilterBar.tsx
import React from "react";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "../../../components/ui";
import type { ParameterFilters, StatusFilter } from "../types";

type Props = {
  groups: string[];
  filters: ParameterFilters;
  onChange: (next: Partial<ParameterFilters>) => void;
  onReset: () => void;
  onReload?: () => void;
  loading?: boolean;
  total?: number; // optional info badge
};

const FilterBar: React.FC<Props> = ({ groups, filters, onChange, onReset, onReload, loading, total }) => {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Group */}
        <div>
          <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
            Group
          </label>
          <select
            id="group"
            value={filters.group}
            onChange={(e) => onChange({ group: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Groups</option>
            {groups?.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Search */}
        <div className="md:col-span-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search parameters…"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="pl-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onReload}
            disabled={loading}
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="ml-1">Reload</span>
          </Button>
          <Button
            type="button"
            className="w-full"
            variant="secondary"
            onClick={onReset}
            disabled={loading || (!filters.group && !filters.status && !filters.search)}
          >
            <XMarkIcon className="h-4 w-4" />
            <span className="ml-1">Clear</span>
          </Button>
        </div>
      </div>

      {/* Applied filters summary */}
      {(filters.group || filters.status || filters.search) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Active filters:</span>
          {filters.group && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">Group: {filters.group}</span>}
          {filters.status && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">Status: {filters.status === "true" ? "Active" : "Inactive"}</span>}
          {filters.search && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">Search: “{filters.search}”</span>}
          {typeof total === "number" && (
            <span className="ml-auto text-gray-500">Showing <strong>{total}</strong> result{total === 1 ? "" : "s"}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
