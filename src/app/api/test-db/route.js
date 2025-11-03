// src/app/api/test-db/route.js
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Just test with a lightweight query
    const { data, error } = await supabase
      .from("appointments") // 👈 use any table you know exists
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Supabase query failed", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Supabase connection is working!", data },
      { status: 200 }
    );
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected server error", error: err.message },
      { status: 500 }
    );
  }
}
