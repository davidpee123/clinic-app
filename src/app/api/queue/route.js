import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✅ Create Supabase client using the Service Role Key (for server-side access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("patients_queue")
      .select("id, patient_name, doctor_name, status, check_in_time, queue_position")
      .order("queue_position", { ascending: true });

    if (error) {
      console.error("Failed to fetch queue data:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
