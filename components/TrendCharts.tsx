"use client";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DailyEntry } from "@/types/entry";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TrendChart({ days = 60 }: { days?: number }) {
  const { data, isLoading, mutate } = useSWR<DailyEntry[]>(`/api/entries?days=${days}`, fetcher);

  if (isLoading) return <p>Carico grafico…</p>;
  const rows = (data ?? []).map(d => ({ ...d, day: d.day.slice(5) })); // mostra solo MM-DD

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Se vuoi far aggiornare il grafico dopo un salvataggio dal form:
// passa a TrendChart l'handler mutate -> vedi pagina sotto.
