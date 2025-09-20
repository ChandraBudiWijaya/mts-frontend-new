// src/features/workplans/components/StatusChip.tsx
import type { WorkPlanStatus } from '../types';

const COLOR: Record<WorkPlanStatus, string> = {
  Approved: 'bg-green-600',
  Submitted: 'bg-blue-500',
  Draft: 'bg-gray-400',
  Rejected: 'bg-red-500',
};

const LABEL: Record<WorkPlanStatus, string> = {
  Approved: 'Done',
  Submitted: 'Open',
  Draft: 'Draft',
  Rejected: 'Rejected',
};

export default function StatusChip({ status }: { status: WorkPlanStatus }) {
  return (
    <span className={`${COLOR[status]} text-white text-xs px-3 py-1 rounded-full inline-flex items-center justify-center min-w-[64px]`}>
      {LABEL[status]}
    </span>
  );
}
