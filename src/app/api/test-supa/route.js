import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("appointments").select("*").limit(1);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ Supabase test failed:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
