"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorsList() {
  const supabase = createClientComponentClient();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) console.error(error);
      else setDoctors(data);
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Our Specialists
        </h1>

        {doctors.length === 0 ? (
          <p className="text-center text-gray-500">No doctors available yet.</p>
        ) : (
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
