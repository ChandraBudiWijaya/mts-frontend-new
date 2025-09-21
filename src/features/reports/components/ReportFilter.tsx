import { useState } from "react";
import {Button, Input, Card} from "../../../components/ui";
import type { ReportFilterState } from "../types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Filter bar gaya sama dengan Users page
export default function ReportFilter({
  onSearch,
}: {
  onSearch: (f: ReportFilterState) => void;
}) {
  const [form, setForm] = useState<ReportFilterState>({
    pg: "",
    wilayah: "",
    mandorId: "",
    dateStart: "",
    dateEnd: "",
  });

  const set = (k: keyof ReportFilterState, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Card className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plantation Group (PG)
          </label>
          <Input
            value={form.pg ?? ""}
            onChange={(e) => set("pg", e.target.value)}
            placeholder="PG1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wilayah
          </label>
          <Input
            value={form.wilayah ?? ""}
            onChange={(e) => set("wilayah", e.target.value)}
            placeholder="W01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Mandor (employee_id)
          </label>
          <Input
            value={form.mandorId ?? ""}
            onChange={(e) => set("mandorId", e.target.value)}
            placeholder="EMP001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dari
          </label>
          <Input
            type="date"
            value={form.dateStart}
            onChange={(e) => set("dateStart", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sampai
          </label>
          <Input
            type="date"
            value={form.dateEnd}
            onChange={(e) => set("dateEnd", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 md:text-right">
        <Button
          onClick={() => onSearch(form)}
          disabled={!form.dateStart || !form.dateEnd}
          className="bg-amber-400 hover:bg-amber-500 text-white inline-flex items-center gap-2"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
          Search
        </Button>
      </div>
    </Card>
  );
}
