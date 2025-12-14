// src/app/api/bookings/route.js 

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
      try {
            const cookieStore = await cookies();
            const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

            const body = await req.json();

            // ----------------------------------------------------------------------
            // 1. Destructure all fields being sent from the client's payload
            // ----------------------------------------------------------------------
            const {
                  patientName,
                  doctorName,
                  appointmentTime, // The combined date/time string from the client
                  reason_for_visit, // Notes field from client
                  patientEmail,
                  patientPhone,
                  doctorId,
            } = body;

            // ----------------------------------------------------------------------
            // 2. Validation Check (Catches the 400 error)
            // ----------------------------------------------------------------------
            if (!patientName || !doctorName || !appointmentTime || !patientEmail) {
                  return NextResponse.json(
                        {
                              message: "Missing required booking details (Name, Doctor, Time, Email).",
                              details: { patientName, doctorName, appointmentTime, patientEmail }
                        },
                        { status: 400 }
                  );
            }

            // ----------------------------------------------------------------------
            // 3. Authentication (Catches the 401 error)
            // ----------------------------------------------------------------------
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

            // ----------------------------------------------------------------------
            // 4. BUILD FINAL PAYLOAD (Ensures all NOT NULL constraints are met)
            // ----------------------------------------------------------------------
            const appointmentStartTime = appointmentTime;
            // Calculate 30 minutes later for end_time (necessary for NOT NULL constraint)
            const endTime = new Date(new Date(appointmentStartTime).getTime() + 30 * 60000).toISOString();

            const insertPayload = {
                  // Mandatory Fields for Database Integrity:
                  patient_id: user.id, // FIX for the original NOT NULL constraint error
                  start_time: appointmentStartTime, // FIX for potential time NOT NULL constraint
                  end_time: endTime, // FIX for potential time NOT NULL constraint
                  duration_minutes: 30, // Assuming 30 minutes is the default duration

                  // Other Fields:
                  user_id: user.id, // Secondary user ID link
                  doctor_id: doctorId, // Link to the doctor user ID (if your schema uses this)
                  patient_name: patientName,
                  patient_email: patientEmail,
                  patient_phone: patientPhone,
                  doctor_name: doctorName,
                  appointment_time: appointmentStartTime, // Keeping this field as well
                  status: "pending",
                  reason_for_visit: reason_for_visit,
            };

            // Log the payload to the server console for debugging
            console.log("Attempting to insert payload:", insertPayload);

            // ----------------------------------------------------------------------
            // 5. DATABASE INSERT
            // ----------------------------------------------------------------------
            const { data, error } = await supabase
                  .from("appointments")
                  .insert([insertPayload])
                  .select();

            if (error) throw error;

            // Return success response
            const bookedAppointment = data[0];

            return NextResponse.json(
                  {
                        message: "Appointment booked successfully.",
                        referenceId: bookedAppointment.id,
                        doctorName: bookedAppointment.doctor_name,
                        bookedDate: bookedAppointment.start_time.split('T')[0],
                        bookedTime: bookedAppointment.start_time.split('T')[1].substring(0, 5)
                  },
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