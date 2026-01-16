import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role } = body;

    // 1. Validate that a role is provided (doctor or patient)
    if (!role || !['doctor', 'patient'].includes(role)) {
      throw new Error("Invalid or missing user role.");
    }

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        data: {
          full_name: `${firstName} ${lastName}`,
          user_role: role // 'doctor' or 'patient'
        },
      },
    });

    if (authError) throw authError;
    const userId = authData.user?.id;
    if (!userId) throw new Error("User ID missing after signup.");

    // 3. Initialize Admin Client
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) throw new Error("Server configuration error.");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey
    );

    // 4. DYNAMIC ROUTING: Insert into the correct table
    // We determine the table name directly from the role passed by the frontend
    const targetTable = role === 'doctor' ? 'doctors' : 'patients';

    const insertData = {
      id: userId,
      full_name: `${firstName} ${lastName}`,
      email: email,
      phone: body.phone,
    };

    // Add role-specific fields
    if (role === 'doctor') {
      insertData.specialization = body.specialization || 'General';
    } else {
      insertData.gender = body.gender;
      insertData.date_of_birth = body.dateOfBirth;
    }

    const { error: dbError } = await supabaseAdmin
      .from(targetTable)
      .insert([insertData]);

    if (dbError) throw dbError;

    return NextResponse.json(
      { success: true, message: `Registration as ${role} successful!` },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}