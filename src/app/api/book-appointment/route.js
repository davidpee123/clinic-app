import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Received body:", body);

    const { patientName, doctorName, appointmentTime } = body;

    if (!patientName || !doctorName) {
      return NextResponse.json(
        { message: "Patient name and doctor name are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ✅ Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return NextResponse.json(
        { message: "User not authenticated. Please log in again." },
        { status: 401 }
      );
    }

    // ✅ Insert appointment with logged-in user's ID
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          user_id: user.id,
          patient_name: patientName,
          doctor_name: doctorName,
          appointment_time: appointmentTime,
          status: "pending",
          reason_for_visit: "consultation",
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { message: "Failed to book appointment.", error },
        { status: 500 }
      );
    }

    console.log("✅ Appointment inserted:", data);
    return NextResponse.json(
      { message: "Appointment booked successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Unexpected server error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: error.message },
      { status: 500 }
    );
  }
}
