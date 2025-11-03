import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient();
  const body = await req.json();

  // Set or clear the session on the server
  if (body.event === "SIGNED_IN" && body.session) {
    await supabase.auth.setSession(body.session);
  } else if (body.event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  // ✅ Absolute URL for redirect
  const redirectTo = body.redirectTo || "/patient-portal";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // your app URL
  const absoluteUrl = new URL(redirectTo, baseUrl);

  return NextResponse.redirect(absoluteUrl);
}
