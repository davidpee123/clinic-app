
"use client"

import { useEffect, useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "@/components/Header";
import DoctorCard from "@/components/DoctorCard";
import SearchFilter from "@/components/SearchFilter"; // <-- Import new component

export default function DoctorsList() {
    const supabase = createClientComponentClient();
    const [doctors, setDoctors] = useState([]);
    const [allSpecialties, setAllSpecialties] = useState([]); // State for dropdown options
    const [selectedSpecialty, setSelectedSpecialty] = useState(''); // State for active filter
    const [loading, setLoading] = useState(true);

    // Fetch Specialties and Doctors
    useEffect(() => {
        const fetchDoctorsAndSpecialties = async () => {
            setLoading(true);

            // 1. Fetch ALL Specialties for the dropdown
            const { data: specialtiesData, error: specError } = await supabase
                .from("doctors")
                .select("specialization")
                .not("specialization", "is", null); // Exclude null/empty specialties
            
            if (specialtiesData) {
                // Deduplicate and store unique specialties
                const uniqueSpecialties = [...new Set(specialtiesData.map(d => d.specialization))].sort();
                setAllSpecialties(['All Specialties', ...uniqueSpecialties]); // Add 'All' option
            }
            if (specError) console.error("Error fetching specialties:", specError);


            // 2. Fetch Doctors based on the selected specialty
            let doctorQuery = supabase
                .from("doctors")
                .select("*")
                .order('full_name', { ascending: true });
            
            // Apply filter if a specialty is selected (and it's not the default 'All')
            if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
                doctorQuery = doctorQuery.eq('specialization', selectedSpecialty);
            }
            
            const { data: doctorData, error: doctorError } = await doctorQuery;

            if (doctorError) console.error("Error fetching doctors:", doctorError);
            else setDoctors(doctorData || []);

            setLoading(false);
        };
        
        fetchDoctorsAndSpecialties();
    }, [supabase, selectedSpecialty]); // Re-run effect when specialty changes

    // Memoize the count of specialists
    const specialistCount = useMemo(() => doctors.length, [doctors]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
                    Our Specialists
                </h1>

                {/* --- Search and Filter Area --- */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <SearchFilter 
                        specialties={allSpecialties}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        loading={loading}
                    />
                    <p className="text-lg font-semibold text-gray-700">
                        {specialistCount} Specialist{specialistCount !== 1 ? 's' : ''} Found
                    </p>
                </div>
                {/* ----------------------------- */}

                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading doctor list...</p>
                ) : specialistCount === 0 ? (
                    <p className="text-center text-gray-500">No doctors available for the selected criteria.</p>
                ) : (
                    <div className="flex flex-col gap-6"> 
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}