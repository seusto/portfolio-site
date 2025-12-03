import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { day?: string; notes?: string };
    const day = typeof body.day === "string" ? body.day : "";
    if (!day) return NextResponse.json({ error: "day mancante" }, { status: 400 });

    const { error } = await supabase
      .from("daily_values")
      .update({ notes: typeof body.notes === "string" ? body.notes : null })
      .eq("day", day);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Notes update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
