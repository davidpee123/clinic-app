import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const supabase = createClient();

    // Supabase handles sending reset email (you must configure Auth > Email in Supabase dashboard)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`, // page where user sets new password
    });

    if (error) {
      console.error("❌ Password reset error:", error.message);
      return NextResponse.json(
        { message: "Failed to send reset link", error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Password reset link sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return NextResponse.json(
      { message: "Unexpected server error", error: err.message },
      { status: 500 }
    );
  }
}
