"use client";
import { useMemo, useState } from "react";

type Props = {
  value?: Date;
  onChange?: (d: Date) => void;
  mobileWindowDays?: number;   // giorni visibili in mobile (default 14)
  mobileStartOffset?: number;  // offset da oggi (default 0)
  className?: string;
};

export default function Calendar({
  value,
  onChange,
  mobileWindowDays = 14,
  mobileStartOffset = 0,
  className = "",
}: Props) {
  const oggi = stripTime(new Date());
  const [selezionata, setSelezionata] = useState<Date>(value ? stripTime(value) : oggi);

  // --- MOBILE: lista giorni scrollabile ---
  const mobileDays = useMemo(() => {
    const out: Date[] = [];
    const start = addDays(oggi, mobileStartOffset);
    for (let i = 0; i < mobileWindowDays; i++) out.push(addDays(start, i));
    return out;
  }, [oggi, mobileWindowDays, mobileStartOffset]);

  // --- DESKTOP: settimana orizzontale ---
  const [weekCursor, setWeekCursor] = useState<Date>(startOfWeek(selezionata)); // lunedì
  const weekDays = useMemo(() => makeWeek(weekCursor), [weekCursor]);

  const pick = (d: Date) => {
    const dt = stripTime(d);
    setSelezionata(dt);
    onChange?.(dt);
    setWeekCursor(startOfWeek(dt));
  };

  return (
    <div className={className}>
      {/* MOBILE */}
      <section className="sm:hidden" aria-label="Selettore giorni">
        <ul className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-2 py-2 snap-x snap-mandatory">
          {mobileDays.map((d) => {
            const attiva = isSameDay(d, selezionata);
            return (
              <li key={d.toISOString()} className="snap-start shrink-0">
                <button
                  onClick={() => pick(d)}
                  className={[
                    "flex min-w-16 flex-col items-center justify-center rounded-2xl px-4 py-3 shadow-sm transition-colors",
                    "ring-1 ring-black/5 dark:ring-white/10",
                    attiva
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "bg-white text-black/80 dark:bg-neutral-800 dark:text-white/80",
                  ].join(" ")}
                  aria-pressed={attiva}
                >
                  <span className="text-lg font-semibold leading-none">{d.getDate()}</span>
                  <span className="text-xs opacity-80">{weekdayShortIT(d)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* DESKTOP */}
      <section className="hidden sm:block">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-semibold">{monthYearIT(weekCursor)}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setWeekCursor(addDays(weekCursor, -7))}
              className="rounded-xl px-3 py-1.5 text-sm ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Settimana precedente"
            >
              ←
            </button>
            <button
              onClick={() => {
                setWeekCursor(startOfWeek(oggi));
                setSelezionata(oggi);
                onChange?.(oggi);
              }}
              className="rounded-xl px-3 py-1.5 text-sm ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Oggi
            </button>
            <button
              onClick={() => setWeekCursor(addDays(weekCursor, 7))}
              className="rounded-xl px-3 py-1.5 text-sm ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Settimana successiva"
            >
              →
            </button>
          </div>
        </div>

        {/* tabs puramente visuali */}
        <div className="mb-3 inline-flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
          <span className="rounded-xl px-3 py-1 text-sm text-black/50 dark:text-white/60">Mese</span>
          <span className="rounded-xl bg-white px-3 py-1 text-sm shadow-sm dark:bg-neutral-800">Settimana</span>
          <span className="rounded-xl px-3 py-1 text-sm text-black/50 dark:text-white/60">Giorno</span>
        </div>

        {/* strip settimanale con card */}
        <div className="flex items-stretch gap-3">
          <button
            onClick={() => setWeekCursor(addDays(weekCursor, -7))}
            className="grid aspect-[3/2] w-20 place-items-center rounded-2xl ring-1 ring-black/10 dark:ring-white/15 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Settimana precedente"
          >
            <span className="text-xl">‹</span>
          </button>

          {weekDays.map((d) => {
            const attiva = isSameDay(d, selezionata);
            return (
              <button
                key={d.toISOString()}
                onClick={() => pick(d)}
                className={[
                  "flex aspect-[3/2] w-full max-w-[180px] flex-col items-center justify-center gap-1 rounded-2xl transition-colors",
                  "ring-1 ring-black/10 dark:ring-white/15",
                  attiva
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "bg-white text-black dark:bg-neutral-800 dark:text-white",
                  !attiva && "hover:bg-black/5 dark:hover:bg-white/10",
                ].join(" ")}
                aria-pressed={attiva}
              >
                <div className="text-3xl font-bold leading-none">{d.getDate()}</div>
                <div className="text-sm opacity-80">{weekdayLongIT(d)}</div>
              </button>
            );
          })}

          <button
            onClick={() => setWeekCursor(addDays(weekCursor, 7))}
            className="grid aspect-[3/2] w-20 place-items-center rounded-2xl ring-1 ring-black/10 dark:ring-white/15 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Settimana successiva"
          >
            <span className="text-xl">›</span>
          </button>
        </div>
      </section>
    </div>
  );
}

/* --------- helpers data --------- */
function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfWeek(d: Date) {
  // settimana LUN-DOM
  const day = d.getDay(); // 0=Dom ... 6=Sab
  const diff = (day + 6) % 7; // 0 per Lun
  return stripTime(addDays(d, -diff));
}
function makeWeek(start: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

/* --------- formattazioni IT --------- */
function capFirst(s: string) {
  return s.replace(/\p{L}/u, (c) => c.toUpperCase());
}
function weekdayShortIT(d: Date) {
  // “Lun, Mar, …”
  return capFirst(
    new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(d).replace(".", "")
  );
}
function weekdayLongIT(d: Date) {
  // “Lunedì, Martedì, …”
  return capFirst(new Intl.DateTimeFormat("it-IT", { weekday: "long" }).format(d));
}
function monthYearIT(d: Date) {
  // “Novembre 2024”
  return capFirst(new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(d));
}
