"use client";
import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function Averages({ days = 90 }: { days?: number }) {
  const { data, isLoading } = useSWR<{ weekly: {week:string; avg:number}[]; monthly:{month:string; avg:number}[] }>(
    `/api/entries/summary?days=${days}`,
    fetcher
  );

  if (isLoading) return <p>Calcolo medie…</p>;
  if (!data) return <p>Nessun dato.</p>;

  const lastWeek = data.weekly.at(-1)?.avg ?? null;
  const lastMonth = data.monthly.at(-1)?.avg ?? null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Media ultima settimana</p>
        <p className="text-2xl font-semibold">{lastWeek ?? "—"}</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Media ultimo mese</p>
        <p className="text-2xl font-semibold">{lastMonth ?? "—"}</p>
      </div>
    </div>
  );
}
