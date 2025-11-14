import { NextResponse } from "next/server";

// ✅ Handle GET request — availability check
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    if (!doctorId || !date) {
      return NextResponse.json(
        { message: "Missing required parameters: doctorId and date" },
        { status: 400 }
      );
    }

    // Mock available times
    let availableTimes = ["8:00AM", "9:00AM", "10:00AM", "11:00AM", "1:00PM", "3:00PM"];

    // Simulate a busy slot for demonstration
    if (doctorId === "2") {
      availableTimes = availableTimes.filter((t) => t !== "9:00AM");
    }

    return NextResponse.json({ availableTimes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Handle POST request — create booking
export async function POST(request) {
  try {
    const data = await request.json();

    if (
      !data.name ||
      !data.email ||
      !data.doctorId ||
      !data.selectedDate ||
      !data.selectedTime
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required booking information. Please check name, email, doctor, date, and time.",
        },
        { status: 400 }
      );
    }

    // Simulate conflict for Dr. David Peter at 9AM
    if (data.selectedTime === "9:00AM" && data.doctorId === "2") {
      return NextResponse.json(
        {
          message:
            "Conflict detected: The 9:00 AM slot is no longer available. Please select another time.",
          isConflict: true,
        },
        { status: 409 }
      );
    }

    const bookingReference = `REF-${Math.floor(Math.random() * 90000) + 10000}`;
    console.log(`[BOOKING SUCCESS] Ref: ${bookingReference}`, data);

    return NextResponse.json(
      {
        message: "Booking successfully confirmed.",
        referenceId: bookingReference,
        doctorName: data.doctorName,
        bookedDate: data.selectedDate,
        bookedTime: data.selectedTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing booking request:", error);
    return NextResponse.json(
      { message: "Internal server error. Could not finalize the booking." },
      { status: 500 }
    );
  }
}
