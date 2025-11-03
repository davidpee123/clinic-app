import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ⚠️ ORIGINAL CLIENT: Uses ANON Key for public-facing signup (Step 1)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // ------------
    const body = await req.json();

    // 1️⃣ Create a Supabase Auth user (with ANON client)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (authError) throw authError;

    // 2️⃣ Get the newly created user ID
    const userId = authData.user?.id;

    if (!userId) {
      // This should ideally never happen after a successful signup
      throw new Error("User ID missing after signup.");
    }

    // 🛑 NEW CODE BLOCK: Initialize Service Role Client (Step 3 Setup)
    // This client bypasses RLS and timing issues to ensure the DB insert works.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // 👈 Use the Service Role Key here
    );

    // 4️⃣ Create a matching patient record using the SERVICE ROLE client
    const { error: patientError } = await supabaseAdmin.from("patients").insert([
      {
        id: userId, // 👈 Links to the new auth.users record
        full_name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        date_of_birth: body.dateOfBirth,
        // Add all other patient fields here
      },
    ]);

    if (patientError) throw patientError;

    // 5️⃣ Respond to the frontend
    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! A confirmation email has been sent. Please verify your email before signing in.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
