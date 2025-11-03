"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// ✅ This is the only client you need for client-side components
export const supabase = createClientComponentClient();


