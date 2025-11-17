import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper: convert "8:00AM" → "8:00 AM"
function normalizeTimeString(time) {
    return time.replace(/(AM|PM)$/i, " $1").trim();
}

// Helper: convert to safe 24-hour format
function convertTo24Hour(date, timeRaw) {
    const normalized = normalizeTimeString(timeRaw);
    const dateTime = new Date(`${date} ${normalized}`);

    if (isNaN(dateTime)) {
        console.error("❌ Failed date parsing:", `${date} ${normalized}`);
        return null;
    }

    return dateTime;
}

// Strong fix: calculate end time
function calculateEndTime(selectedDate, startTimeRaw, durationMinutes) {
    const start = convertTo24Hour(selectedDate, startTimeRaw);
    if (!start) return null;

    const end = new Date(start.getTime() + durationMinutes * 60000);

    // Return formatted end time in AM/PM
    return end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function generateDummyVideoLink(id) {
    return `https://dummy.video.link/meeting/${id}`;
}

export async function POST(request) {
    try {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const payload = await request.json();
        if (!payload.doctorId || !payload.selectedDate || !payload.selectedTime || !payload.name) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Duration mock
        let durationMinutes = 30;
        if (payload.serviceName?.includes("Cardiology")) durationMinutes = 45;
        if (payload.serviceName?.includes("Pediatric")) durationMinutes = 20;

        const endTimeRaw = calculateEndTime(
            payload.selectedDate,
            payload.selectedTime,
            durationMinutes
        );

        if (!endTimeRaw) {
            return NextResponse.json({ message: "Invalid time format" }, { status: 400 });
        }

        const startDateTimeString = `${payload.selectedDate} ${normalizeTimeString(payload.selectedTime)}`;
        const endDateTimeString = `${payload.selectedDate} ${endTimeRaw}`;

        const referenceId = crypto.randomUUID();
        const videoLink = generateDummyVideoLink(referenceId);

        const appointmentRecord = {
            id: referenceId,
            doctor_id: payload.doctorId,
            user_id: user.id,
            patient_name: payload.name,
            patient_email: payload.email || "",
            patient_phone: payload.phone || "",
            doctor_name: payload.doctorName || "Unknown Doctor",
            start_time: startDateTimeString,
            end_time: endDateTimeString,
            appointment_time: startDateTimeString,
            status: "Booked",
            service_name: payload.serviceName || "General Consultation",
            notes: payload.notes || "",
            video_link: videoLink,
            reason_for_visit: payload.reasonForVisit || "",
            created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("appointments").insert([appointmentRecord]);

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Booking successful",
            appointment: appointmentRecord,
        });
    } catch (err) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .eq("user_id", user.id)
            .order("start_time", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ appointments: data });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch appointments" }, { status: 500 });
    }
}
