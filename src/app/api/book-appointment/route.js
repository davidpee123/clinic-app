import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const body = await req.json();
    const { patientName, doctorName, appointmentTime } = body;

    if (!patientName || !doctorName) {
      return NextResponse.json(
        { message: "Patient name and doctor name are required." },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User not authenticated. Please log in again." },
        { status: 401 }
      );
    }

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

    if (error) throw error;

    return NextResponse.json(
      { message: "Appointment booked successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    return NextResponse.json(
      {
        message: "An error occurred while booking appointment.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
