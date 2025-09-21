import api from "../../../shared/api";
import type { ReportFilterState, ReportSummary, VisitDetail, TrackingPoint } from "../types";

const BASE = "/reports";

const pick = (o: Record<string, any>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export async function fetchDashboardStats(f: ReportFilterState): Promise<ReportSummary[]> {
  const params = pick({ start_date: f.dateStart, end_date: f.dateEnd, pg: f.pg, wilayah: f.wilayah });
  const { data } = await api.get(`${BASE}/dashboard-stats`, { params });
  return (data?.summaries ?? data ?? []) as ReportSummary[];
}

export async function fetchVisitDetails(f: ReportFilterState): Promise<VisitDetail[]> {
  const params = pick({ start_date: f.dateStart, end_date: f.dateEnd, employee_id: f.mandorId });
  const { data } = await api.get(`${BASE}/visit-details`, { params });
  return (data?.details ?? data ?? []) as VisitDetail[];
}

export async function fetchTrackingPoints(employeeId: string, date: string): Promise<TrackingPoint[]> {
  const { data } = await api.get(`${BASE}/tracking-points`, { params: { employee_id: employeeId, date } });
  return (data?.data ?? data ?? []) as TrackingPoint[];
}
