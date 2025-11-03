
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { queueId, newStatus } = await req.json();
    if (!queueId || !newStatus) {
      return NextResponse.json(
        { message: "queueId and newStatus are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["waiting", "pending", "met"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("patients_queue")
      .update({ status: newStatus })
      .eq("id", queueId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { message: "Failed to update status." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: " Queue status updated successfully!", updatedEntry: data },
      { status: 200 }
    );
  } catch (error) {
    console.error( "Unexpected server error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: error.message },
      { status: 500 }
    );
  }
}
