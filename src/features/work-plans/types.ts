// src/features/workplans/types.ts
export type WorkPlanStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export type EmployeeLite = { id: string; name: string };
export type GeofenceLite = { id: number; name: string; location_code?: string };

export type WorkPlanRow = {
  id: number;
  date: string; // YYYY-MM-DD
  spk_number?: string | null;
  activity: string;
  status: WorkPlanStatus;
  employee?: EmployeeLite | null;
  geofence?: GeofenceLite | null;
  wilayah?: string | null;
  pg?: string | null;
  created_by?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type Option = { value: string; label: string };

export type WorkPlanFilters = {
  plantation_group: string;
  wilayah: string;
  mandor: string;
  date: string; // YYYY-MM-DD or ''
};
