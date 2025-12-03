import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST(req: Request) {
  try {
    const { day, notes } = await req.json();
    if (!day) return NextResponse.json({ error: "day mancante" }, { status: 400 });

    const { error } = await supabase
      .from("daily_values")
      .update({ notes })
      .eq("day", day);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Notes update failed" }, { status: 500 });
  }
}
