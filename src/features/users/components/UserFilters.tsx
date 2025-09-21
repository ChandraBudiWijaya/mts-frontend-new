/**
 * features/users/components/UserFilters.tsx
 * ------------------------------------------------------------
 * Komponen filter bar (PG, Role, Name) + tombol Search.
 * Stateless: seluruh state dikelola oleh parent (Users.tsx).
 * Debounce untuk input name ada di sini.
 */
import { useRef } from 'react';
import Button from '@/components/ui/Button';

type Props = {
  pgOptions: string[];
  roles: Array<{ id: number; name: string }>;
  filters: { plantation_group: string; name: string; role: string; };
  setFilters: (f: any) => void;
  onSearch: () => void;
};

export default function UserFilters({ pgOptions, roles, filters, setFilters, onSearch }: Props) {
  const nameDebounceRef = useRef<number | null>(null);

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
          <select
            value={filters.plantation_group}
            onChange={(e) => { setFilters((f:any)=>({ ...f, plantation_group: e.target.value })); }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            {pgOptions.map(pg => <option key={pg} value={pg}>{pg}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => { setFilters((f:any)=>({ ...f, role: e.target.value })); }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            {roles.map(r => (<option key={r.id} value={r.name}>{r.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama / Username</label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => {
              const v = e.target.value;
              if (nameDebounceRef.current) window.clearTimeout(nameDebounceRef.current);
              nameDebounceRef.current = window.setTimeout(() => {
                setFilters((f:any)=>({ ...f, name: v }));
              }, 300) as unknown as number;
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Cari nama atau username..."
          />
        </div>
        <div className="md:text-right">
          <Button onClick={onSearch} className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-white font-medium px-5 py-2">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
