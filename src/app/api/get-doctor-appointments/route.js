import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get doctor user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: "Doctor not authenticated" }, { status: 401 });
    }

    // Fetch appointments for DOCTOR
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", user.id)
      .order("start_time", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ appointments: data }, { status: 200 });

  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctor's appointments" },
      { status: 500 }
    );
  }
}
