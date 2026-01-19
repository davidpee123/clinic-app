"use client";

import { useEffect, useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "@/components/Header";
import DoctorCard from "@/components/DoctorCard";
import SearchFilter from "@/components/SearchFilter";

export default function DoctorsList() {
    const supabase = createClientComponentClient();

    const [doctors, setDoctors] = useState([]);
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // ✅ CORRECT AUTH CHECK (SESSION-BASED)
    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Auth error:", error);
                setUser(null);
                return;
            }

            setUser(data.session?.user ?? null);
        };

        getSession();
    }, [supabase]);

    // ✅ FETCH DOCTORS & SPECIALTIES
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);

            // Fetch specialties
            const { data: specialtiesData } = await supabase
                .from("doctors")
                .select("specialization")
                .not("specialization", "is", null);

            if (specialtiesData) {
                const uniqueSpecialties = [
                    ...new Set(specialtiesData.map(d => d.specialization)),
                ].sort();

                setAllSpecialties(["All Specialties", ...uniqueSpecialties]);
            }

            // Fetch doctors
            let doctorQuery = supabase
                .from("doctors")
                .select("*")
                .order("full_name", { ascending: true });

            if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
                doctorQuery = doctorQuery.eq("specialization", selectedSpecialty);
            }

            const { data: doctorData } = await doctorQuery;
            setDoctors(doctorData || []);
            setLoading(false);
        };

        fetchInitialData();
    }, [supabase, selectedSpecialty]);

    const specialistCount = useMemo(() => doctors.length, [doctors]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">

                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <SearchFilter
                        specialties={allSpecialties}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        loading={loading}
                    />
                    <p className="text-lg font-semibold text-gray-700">
                        {specialistCount} Specialist
                        {specialistCount !== 1 ? "s" : ""} Found
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                isLoggedIn={!!user} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
