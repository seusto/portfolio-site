import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE!;
const supabase = createClient(url, service);

const todayISO = () => new Date().toISOString().slice(0, 10);

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const days = Number(u.searchParams.get("days") || 60);
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("daily_values")
      .select("day, value, notes, measured_at")
      .gte("day", since)
      .order("day", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "GET failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const _day = typeof body.day === "string" ? body.day.trim() : "";
    const day = _day || todayISO();

    const raw = String(body.value ?? "").replace(",", ".");
    const value = Number.parseFloat(raw);
    const notes = typeof body.notes === "string" ? body.notes : null;

    if (!Number.isFinite(value)) {
      return NextResponse.json({ error: "Valore non valido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("daily_values")
      .upsert({ day, value, notes, measured_at: new Date().toISOString() }, { onConflict: "day" });

    if (error) throw error;
    return NextResponse.json({ ok: true, day, value, notes });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "POST failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
