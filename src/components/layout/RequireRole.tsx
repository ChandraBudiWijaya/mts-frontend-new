import React from 'react';
import { useAuth } from '../../shared/hooks';

interface RequireRoleProps {
  role: string;
  children: React.ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!hasRole(role)) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
        Anda tidak memiliki akses (role) yang sesuai.
      </div>
    );
  }

  return <>{children}</>;
}

