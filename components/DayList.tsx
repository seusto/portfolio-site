"use client";
import useSWR from "swr";
import { useState } from "react";

type Row = { day: string; value: number; notes: string | null; measured_at: string | null };
const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function DayList({ days = 30 }: { days?: number }) {
  const key = `/api/entries?days=${days}&list=1`; // chiave SWR distinta dal grafico
  const { data, isLoading, mutate } = useSWR<Row[]>(key, fetcher);

  const [editing, setEditing] = useState<string | null>(null);
  const [text, setText] = useState("");

  if (isLoading) return <p>Carico…</p>;
  const rows = (data ?? []).slice().sort((a,b) => a.day < b.day ? 1 : -1); // recenti in alto

  const startEdit = (d: Row) => { setEditing(d.day); setText(d.notes ?? ""); };
  const cancelEdit = () => { setEditing(null); setText(""); };

  const save = async (day: string) => {
    const res = await fetch("/api/entries/notes", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ day, notes: text })
    });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      alert(j.error || "Errore aggiornamento note");
      return;
    }
    setEditing(null);
    mutate(); // refresh lista
  };

  return (
    <div className="divide-y rounded border">
      {rows.map(r => (
        <div key={r.day} className="grid grid-cols-1 gap-2 p-3 md:grid-cols-[110px_1fr]">
          <div className="text-sm text-gray-600">
            <div className="font-medium">{r.day}</div>
            {r.measured_at && (
              <div className="text-xs">misurato: {new Date(r.measured_at).toLocaleString()}</div>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-lg font-semibold">{r.value}</div>
              {editing === r.day ? (
                <div className="space-x-2">
                  <button onClick={() => save(r.day)} className="rounded bg-black px-3 py-1 text-sm text-white">Salva</button>
                  <button onClick={cancelEdit} className="rounded border px-3 py-1 text-sm">Annulla</button>
                </div>
              ) : (
                <button onClick={() => startEdit(r)} className="rounded border px-3 py-1 text-sm">Modifica note</button>
              )}
            </div>

            {editing === r.day ? (
              <textarea
                value={text}
                onChange={e=>setText(e.target.value)}
                className="mt-2 w-full rounded border px-3 py-2"
                placeholder="Note del giorno…"
              />
            ) : (
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{r.notes || <em className="text-gray-400">—</em>}</p>
            )}
          </div>
        </div>
      ))}
      {rows.length === 0 && <div className="p-3 text-sm text-gray-500">Nessun dato.</div>}
    </div>
  );
}
