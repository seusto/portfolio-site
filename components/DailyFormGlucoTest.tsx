"use client";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DailyForm({ daysChart = 60, daysSummary = 90 }:{
  daysChart?: number; daysSummary?: number;
}) {
  const { mutate } = useSWRConfig();
  const [value, setValue] = useState("");
  const [day, setDay] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!day) setDay(todayISO()); }, [day]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setLoading(true);
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ value, day, notes })
    });
    const ct = res.headers.get("content-type") ?? "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    setLoading(false);

    if (!res.ok) {
      alert(typeof data === "string" ? data : data.error || "Errore salvataggio");
      return;
    }

    setValue("");
    // mantieni le note inserite se vuoi; oppure svuotale:
    // setNotes("");

    // refresh grafico, medie e lista
    mutate(`/api/entries?days=${daysChart}`);
    mutate(`/api/entries/summary?days=${daysSummary}`);
    mutate(`/api/entries?days=${daysChart}&list=1`); // (se usi chiave diversa nella lista, vedi sotto)
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
      <div className="md:col-span-1">
        <label className="block text-sm">Valore</label>
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={value}
          onChange={e=>setValue(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="es. 72.5"
          required
        />
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm">Giorno</label>
        <input
          type="date"
          value={day}
          onChange={e=>setDay(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

        <br/>
    
      <div className="md:col-span-2">
        <label className="block text-sm">Note del giorno</label>
        <textarea
          value={notes}
          onChange={e=>setNotes(e.target.value)}
          className="h-[42px] w-full rounded border px-3 py-2"
          placeholder="Appunti/contesto (opzionale)"
        />
      </div>

      <div className="md:col-span-4">
        <button
          type="submit"
          disabled={loading || !value}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Salvo..." : "Salva"}
        </button>
      </div>
    </form>
  );
}
