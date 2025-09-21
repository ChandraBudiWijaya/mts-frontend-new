/**
 * features/users/hooks/useUserOptions.ts
 * ------------------------------------------------------------
 * Hook untuk memuat opsi dropdown yang dibutuhkan User feature:
 * - roles, plantation groups, wilayah, positions
 * Mengemas fallback bila API gagal.
 */
import { useEffect, useState } from 'react';
import { usersApi } from '../services/api';

export function useUserOptions() {
  const [pgOptions, setPgOptions] = useState<string[]>([]);
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  const [wilayahOptions, setWilayahOptions] = useState<string[]>([]);
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pgRes, posRes, wilRes, rolesRes] = await Promise.all([
          usersApi.pgOptions().catch(() => null),
          usersApi.positions().catch(() => null),
          usersApi.wilayahOptions().catch(() => null),
          usersApi.roles().catch(() => null),
        ]);
        const pg = (pgRes?.data?.data ?? []).map((x: any) => String(x.value ?? x.id ?? x.label));
        const pos = Array.isArray(posRes?.data) ? posRes?.data : (posRes?.data ?? []);
        const wil = (wilRes?.data?.data ?? []).map((x: any) => String(x.value ?? x.id ?? x.label));
        const r  = Array.isArray(rolesRes?.data) ? rolesRes?.data : (rolesRes?.data?.data ?? []);

        setPgOptions(pg.length ? pg : ['PG1', 'PG2']);
        setPositionOptions(pos.length ? pos : ['Manager','Supervisor','Assistant Manager','Staff','Operator']);
        setWilayahOptions(wil.length ? wil : []);
        setRoles(r);
      } catch {
        setPgOptions(['PG1','PG2']);
        setPositionOptions(['Manager','Supervisor','Assistant Manager','Staff','Operator']);
        setWilayahOptions(['WIL1','WIL2']);
        setRoles([]);
      }
    })();
  }, []);

  return { pgOptions, positionOptions, wilayahOptions, roles };
}
