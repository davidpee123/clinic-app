// file: src/app/api/login/route.js
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      console.error("❌ Login error:", error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }

    // If login is successful, Supabase automatically sets session cookies
    return NextResponse.json(
      { success: true, message: "Login successful", user: data.user },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected login error:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected server error", error: err.message },
      { status: 500 }
    );
  }
}
