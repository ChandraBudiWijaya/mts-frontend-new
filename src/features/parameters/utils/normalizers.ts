// features/parameters/utils/normalizers.ts
import type { Parameter } from "../types";

export function normalizeParameter(item: any): Parameter {
  const rawStatus = item?.status ?? item?.is_active ?? item?.active;
  let statusBool: boolean;
  if (typeof rawStatus === "boolean") statusBool = rawStatus;
  else if (typeof rawStatus === "number") statusBool = rawStatus === 1;
  else if (typeof rawStatus === "string") {
    const s = rawStatus.toLowerCase();
    statusBool = s === "true" || s === "1" || s === "active";
  } else statusBool = true;

  return {
    id: Number(item?.id ?? item?.parameter_id ?? item?.id_parameter ?? 0),
    param_key: item?.param_key ?? item?.key ?? item?.name ?? item?.code ?? "",
    param_value: item?.param_value ?? item?.value ?? item?.val ?? item?.paramValue ?? "",
    description: item?.description ?? item?.desc ?? "",
    group_name: item?.group_name ?? item?.group ?? item?.groupName ?? item?.category ?? undefined,
    status: statusBool,
    created_at: item?.created_at,
    updated_at: item?.updated_at,
  };
}

export function unwrapListPayload(res: any): any[] {
  const raw = res?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  return [];
}
