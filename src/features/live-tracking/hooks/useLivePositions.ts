// src/features/live-tracking/hooks/useLivePositions.ts
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../services/firebase";
import type { LivePoint } from "../types";

type Opts = { pgId?: string; wilayahId?: string; mandorId?: string };

export function useLivePositions({ pgId, wilayahId, mandorId }: Opts) {
  const [data, setData] = useState<LivePoint[]>([]);
  const qRef = useMemo(() => {
    let qy: any = collection(db, "mandor_live");
    const filters: any[] = [];
    if (pgId) filters.push(where("pgId", "==", pgId));
    if (wilayahId) filters.push(where("wilayahId", "==", wilayahId));
    if (mandorId) filters.push(where("mandorId", "==", mandorId));
    return query(qy, ...filters);
  }, [pgId, wilayahId, mandorId]);

  useEffect(() => {
    const unsub = onSnapshot(qRef, (snap) => {
      const list: LivePoint[] = snap.docs.map(d => ({ ...(d.data() as any) }));
      setData(list);
    });
    return () => unsub();
  }, [qRef]);

  return data;
}
