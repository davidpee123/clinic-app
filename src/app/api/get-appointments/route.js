
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ⚠️ IMPORTANT: The 'request' object must be included to access URL search parameters.
export async function GET(request) {
  try {
    // 1. Read date filtering parameters from the URL
    const { searchParams } = new URL(request.url);
    const startString = searchParams.get('start');
    const endString = searchParams.get('end');

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 2. Get logged-in user (Doctor)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 3. Build the base query
    let query = supabase
      .from("appointments")
      .select("*") // Selects all columns, including video_link, phone_number, email, note
      .eq("doctor_id", user.id) // ✅ FIX: Use 'doctor_id' for consistency with frontend logic
      .order("start_time", { ascending: true });

    // 4. Apply time filtering for "Today's Appointments" if parameters are present
    if (startString && endString) {
      query = query.gte("start_time", startString).lt("start_time", endString);
    }

    // 5. Execute the query
    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ appointments: data }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return NextResponse.json(
      { message: "Failed to fetch appointments", error: error.message },
      { status: 500 }
    );
  }
}