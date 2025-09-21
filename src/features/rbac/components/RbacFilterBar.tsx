import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '../../../components/ui';

interface RbacFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function RbacFilterBar({ searchTerm, onSearchChange }: RbacFilterBarProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="max-w-xs">
        <label htmlFor="role-search" className="block text-sm font-medium text-gray-700 mb-2">
          Cari Role
        </label>
        <Input
          id="role-search"
          placeholder="Ketik nama role..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
