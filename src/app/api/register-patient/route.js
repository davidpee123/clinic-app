import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    // 1. Parse request body
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    // 🔒 FORCE ROLE (do NOT accept from frontend)
    const role = "patient";

    // 2. Basic validation
    if (!email || !password || !firstName || !lastName) {
      throw new Error("Missing required fields.");
    }

    // 3. Create Auth User
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
          data: {
            full_name: `${firstName} ${lastName}`,
            user_role: role,
          },
        },
      });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error("User ID missing after signup.");

    // 4. Create Admin Client (Service Role)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) throw new Error("Server configuration error.");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey
    );

    // 5. Insert into PATIENTS table
    const insertData = {
      id: userId,
      full_name: `${firstName} ${lastName}`,
      email: email,
      phone: body.phone || null,
      gender: body.gender || null,
      date_of_birth: body.dateOfBirth || null,
    };

    const { error: dbError } = await supabaseAdmin
      .from("patients")
      .insert([insertData]);

    if (dbError) throw dbError;

    // 6. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Patient registration successful!",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Registration Error:", err.message);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
