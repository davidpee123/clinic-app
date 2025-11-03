import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // secure key for server routes
);

export async function POST(req) {
  try {
    const { patientName, doctorName } = await req.json();

    if (!patientName || !doctorName) {
      return NextResponse.json(
        { message: "Patient name and doctor name are required." },
        { status: 400 }
      );
    }

    // Find the patient using full_name column
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("full_name", patientName)
      .single();

    if (patientError) {
      console.error("Patient lookup error:", patientError);
    }

    // Insert into patients_queue
    const { data: queueEntry, error: insertError } = await supabase
      .from("patients_queue")
      .insert([
        {
          patient_id: patient?.id || null,
          patient_name: patientName,
          doctor_name: doctorName,
          status: "waiting",
        },
      ])
      .select();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { message: "Could not add to queue." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Checked in successfully!", queueEntry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: error.message },
      { status: 500 }
    );
  }
}

