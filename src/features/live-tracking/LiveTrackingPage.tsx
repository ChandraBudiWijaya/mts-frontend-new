// src/features/live-tracking/LiveTrackingPage.tsx
import { useMemo, useState } from "react";
import Filters from "./components/Filters";
import MapView from "./components/MapView"; // <- Leaflet version
import { useLivePositions } from "./hooks/useLivePositions";
import { useMandors } from "./hooks/useMasterData";
import type { Mandor } from "./types";

export default function LiveTrackingPage() {
  const [filters, setFilters] = useState<{ pgId?: string; wilayahId?: string; mandorId?: string }>({});
  const [applied, setApplied] = useState(filters);
  const live = useLivePositions(applied);
  const mandors = useMandors(applied.pgId, applied.wilayahId);

  const mandorLookup = useMemo<Record<string, Mandor | undefined>>(() => {
    const r: Record<string, Mandor> = {};
    mandors.forEach(m => r[m.id] = m);
    return r;
  }, [mandors]);

  return (
      <div className="space-y-6 bg-gray-50 min-h-screen p-6">
        <div className="text-2xl font-semibold text-gray-900">Live Tracking</div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <Filters value={filters} onChange={setFilters} onSearch={() => setApplied(filters)} />
        </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <MapView points={live} mandorLookup={mandorLookup} />
      </div>
    </div>
  );
}
