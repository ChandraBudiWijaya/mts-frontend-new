// src/features/live-tracking/hooks/useMasterData.ts
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import type { PG, Wilayah, Mandor } from "../types";

export function usePGs() {
  const [data, setData] = useState<PG[]>([]);
  useEffect(() => {
    (async () => {
      const qs = await getDocs(query(collection(db, "plantation_groups"), orderBy("code")));
      setData(qs.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, []);
  return data;
}

export function useWilayah(pgId?: string) {
  const [data, setData] = useState<Wilayah[]>([]);
  useEffect(() => {
    if (!pgId) { setData([]); return; }
    (async () => {
      const qy = query(
        collection(db, "wilayah"),
        where("pgId", "==", pgId),
        orderBy("code")
      );
      const qs = await getDocs(qy);
      setData(qs.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, [pgId]);
  return data;
}

export function useMandors(pgId?: string, wilayahId?: string) {
  const [data, setData] = useState<Mandor[]>([]);
  useEffect(() => {
    if (!pgId) { setData([]); return; }
    (async () => {
      let qy: any = collection(db, "mandors");
      const filters: any[] = [];
      filters.push(where("pgId", "==", pgId));
      if (wilayahId) filters.push(where("wilayahId", "==", wilayahId));
      const qs = await getDocs(query(qy, ...filters));
      setData(qs.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, [pgId, wilayahId]);
  return data;
}
