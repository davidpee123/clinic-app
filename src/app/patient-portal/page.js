"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
    CalendarDays, 
    ClipboardList, 
    HeartPulse, 
    Stethoscope, 
    Plus, 
    User, 
    LogOut 
} from "lucide-react";
import Header from "@/components/Header";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PatientDashboard() {
    // 1. Initialize Supabase Client
    const supabase = createClientComponentClient();
    
    // Always initialize as an empty array to prevent .filter or .map errors
    const [appointments, setAppointments] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Patient User");
    const [userId, setUserId] = useState("loading-user-id");

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                // 2. Get the current authenticated user session
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    setUserName("Guest");
                    setLoading(false);
                    return;
                }

                setUserId(user.id);

                // 3. Fetch Patient Name from the 'patients' table
                const { data: profileData } = await supabase
                    .from('patients')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setUserName(profileData.full_name);
                }

                // 4. Fetch Appointments from your API
                const response = await fetch('/api/patient-appointments');
                
                if (response.ok) {
                    const data = await response.json();
                    // CRITICAL FIX: Ensure the state is only set if data is an array
                    setAppointments(Array.isArray(data) ? data : []);
                } else {
                    console.error("API returned non-ok status");
                    setAppointments([]);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error.message);
                setAppointments([]); // Reset to empty array on failure
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [supabase]);

    // Handle Real Sign Out
    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }, [supabase]);

    // 5. Safe Derived State (Added check for Array.isArray)
    const pendingAppointments = useMemo(() => {
        if (!Array.isArray(appointments)) return 0;
        return appointments.filter((a) => 
            a?.status && a.status.toLowerCase() === "pending"
        ).length;
    }, [appointments]);

    // Helper to format date for display
    const formatAppointmentTime = (isoString) => {
        if (!isoString) return "No Time Set";
        try {
            return new Date(isoString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            <Header />

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Welcome back, <span className="text-blue-600">{userName}</span>!
                        </h1>
                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Patient ID:</span>
                            <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-800">
                                {userId}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Total Appointments</h2>
                            <ClipboardList className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">{Array.isArray(appointments) ? appointments.length : 0}</p>
                    </div>

                    <div className="bg-orange-400 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Pending Requests</h2>
                            <CalendarDays className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">{pendingAppointments}</p>
                    </div>

                    <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Completed Consults</h2>
                            <Stethoscope className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">
                            {(Array.isArray(appointments) ? appointments.length : 0) - pendingAppointments}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-start">
                    <a
                        href="/UrgentCare"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <HeartPulse className="w-5 h-5 animate-pulse" /> Emergency Care
                    </a>

                    <a
                        href="/doctors"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" /> Book New Appointment
                    </a>
                </div>

                {/* List Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Appointments</h2>

                    {loading ? (
                        <div className="text-center py-10 text-blue-500 flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="text-lg font-medium">Loading your records...</span>
                        </div>
                    ) : (!Array.isArray(appointments) || appointments.length === 0) ? (
                        <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-100">
                            <p className="text-gray-500">You currently do not have any appointments recorded.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {appointments.map((a) => (
                                <div
                                    key={a.id}
                                    className={`bg-white shadow-md rounded-xl p-5 border-l-4 transition-shadow ${
                                        a.status?.toLowerCase() === 'confirmed' ? 'border-green-500' :
                                        a.status?.toLowerCase() === 'pending' ? 'border-yellow-500' : 'border-gray-400'
                                    }`}
                                >
                                    <h3 className="text-gray-800 font-bold text-lg mb-1">{a.doctor_name || "Consultation"}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <CalendarDays className="inline w-4 h-4 mr-1 mb-0.5 text-blue-500" />
                                        {formatAppointmentTime(a.appointment_time || a.start_time)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 capitalize">
                                        Status: 
                                        <span className={`font-semibold ml-1 ${
                                            a.status?.toLowerCase() === 'confirmed' ? 'text-green-600' :
                                            a.status?.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                                        }`}>
                                            {a.status}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}