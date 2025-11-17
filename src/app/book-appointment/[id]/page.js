// /app/book-appointment/[id]/page.js

// 1. Imports for Server Component data fetching
import React from 'react';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'; // Import the cookies function

// Import your structural and navigation components
import DoctorProfile from '@/components/DoctorProfile';
import Footer from "@/components/footer";
import Header from '@/components/Header';

// Define the page component as 'async'
export default async function DoctorDetailPage({ params }) {
  // Get the unique doctor ID from the URL (e.g., "12345")
  const doctorId = params.id;

  // --- 2. Initialize Supabase and Fetch Data ---

  // CRITICAL FIX: The cookies() function from 'next/headers' is called synchronously 
  // but is treated as a dynamic API. It MUST NOT be awaited.
  const cookieStore = cookies();

  // Pass the synchronous cookieStore function to createServerComponentClient
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: doctorData, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", doctorId) // Query: Find the row where the 'id' column matches doctorId
    .single(); // Expect only one doctor

  if (error || !doctorData) {
    console.error("Error fetching doctor or doctor not found:", error);
    // Handle case where doctor ID is invalid or data fetch fails
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 text-center py-20">
          <h1 className="text-3xl font-bold text-red-600">Profile Not Available</h1>
          <p className="text-gray-500">The doctor with ID: {doctorId} could not be found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // --- 3. Render the Profile Page with Unique Data ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Pass the uniquely fetched doctor data to the profile component */}
        <DoctorProfile doctor={doctorData} />
      </main>

      <Footer />
    </div>
  );
}