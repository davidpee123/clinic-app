import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const cookieStore = cookies();
        // Initialize Supabase client for use in a Next.js Route Handler
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // 1. Get logged-in user (Patient)
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }

        // 2. Query appointments table, filtering by the patient's ID
        // Assuming your 'appointments' table has a 'patient_id' column
        const { data, error } = await supabase
            .from("appointments")
            .select("*") 
            .eq("patient_id", user.id) // Filter appointments where patient_id matches the logged-in user's ID
            .order("start_time", { ascending: true }); // Use start_time for sorting

        if (error) throw error;

        // Return appointments along with user details for the client component
        return NextResponse.json({ 
            appointments: data, 
            user_id: user.id, 
            user_email: user.email 
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching patient appointments:", error);
        return NextResponse.json(
            { message: "Failed to fetch appointments", error: error.message },
            { status: 500 }
        );
    }
}