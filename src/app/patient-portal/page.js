"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarDays, ClipboardList, HeartPulse, Stethoscope, Plus, User, LogOut } from "lucide-react";
import Header from "@/components/Header";
export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    // Placeholder user data since we can't read cookies/Supabase session here
    const [userName, setUserName] = useState("Patient User"); 
    const [userId, setUserId] = useState("loading-user-id"); 
    
 
    useEffect(() => {
        async function fetchPatientAppointments() {
            setLoading(true);
            try {
                // Fetch from the new dedicated patient appointment route
                const response = await fetch('/api/patient-appointments', {
                    method: 'GET',
                    // Note: Supabase Auth Helpers handles session via cookies automatically
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch appointments.');
                }

                const data = await response.json();
                
                // Update user details based on data if available (optional)
                if (data.user_email) {
                    setUserName(data.user_email.split('@')[0]);
                }
                if (data.user_id) {
                    setUserId(data.user_id);
                }

                // Sort and set appointments
                const sortedAppointments = data.appointments.sort((a, b) => 
                    new Date(a.appointment_time) - new Date(b.appointment_time)
                );

                setAppointments(sortedAppointments);

            } catch (error) {
                console.error("Error fetching patient appointments:", error.message);
                setAppointments([]);
                // In a real app, you might redirect to a login page on 401
            } finally {
                setLoading(false);
            }
        }

        fetchPatientAppointments();
    }, []);

    // Handle Sign Out (Simulated since we don't have Supabase client access here)
    const handleSignOut = useCallback(() => {
        console.log("Sign out triggered. In a real app, this would call supabase.auth.signOut()");
        setAppointments([]);
        setUserName("Guest");
        setUserId("logged-out");
    }, []);


    // Derived State for stats
    const pendingAppointments = useMemo(() => 
        appointments.filter((a) => a.status && a.status.toLowerCase() === "pending").length
    , [appointments]);
    
    // Helper to format date for display
    const formatAppointmentTime = (isoString) => {
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
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    Welcome back, <span className="text-blue-600">{userName}</span>!
                </h1>
                
                {/* User ID for debugging/sharing */}
                <div className="text-xs text-gray-500 mb-6 flex flex-wrap items-center gap-2">
                    <User className="w-3 h-3 text-gray-400"/>
                    <span className="font-medium">Patient ID:</span> 
                    <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-800 break-all">
                        {userId}
                    </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Total Appointments</h2>
                            <ClipboardList className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">{appointments.length}</p>
                    </div>

                    <div className="bg-orange-400 text-white p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Pending Requests</h2>
                            <CalendarDays className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">
                            {pendingAppointments}
                        </p>
                    </div>

                    <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Completed Consults</h2>
                            <Stethoscope className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-4xl font-bold mt-3">
                            {appointments.length - pendingAppointments}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-start">

                    {/* Urgent Care Link */}
                    <a
                        href="/UrgentCare"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition duration-200 transform hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <HeartPulse className="w-5 h-5 animate-pulse" /> Emergency Care
                    </a>

                    {/* Book Now Link */}
                    <a
                        href="/doctors"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition duration-200 transform hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" /> Book New Appointment
                    </a>
                </div>
                
                {/* Upcoming Appointments */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Upcoming & Past Appointments</h2>

                    {loading ? (
                        <div className="text-center py-10 text-blue-500 flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="text-lg">Loading appointments...</span>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl text-center shadow">
                            <p className="text-gray-500 text-md">
                                You currently do not have any appointments recorded.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {appointments.map((a) => (
                                <div 
                                    key={a.id} 
                                    className={`bg-white shadow-lg rounded-xl p-5 border-l-4 transition-shadow ${
                                        a.status && a.status.toLowerCase() === 'confirmed' ? 'border-green-500' : 
                                        a.status && a.status.toLowerCase() === 'pending' ? 'border-yellow-500' : 'border-gray-400'
                                    }`}
                                >
                                    <h3 className="text-gray-800 font-bold text-lg mb-1">{a.doctor_name || a.title || "Consultation"}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <CalendarDays className="inline w-4 h-4 mr-1 mb-0.5 text-blue-500" />
                                        {formatAppointmentTime(a.appointment_time || a.start_time)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 capitalize">
                                        Status: 
                                        <span className={`font-semibold ml-1 ${
                                            a.status && a.status.toLowerCase() === 'confirmed' ? 'text-green-600' : 
                                            a.status && a.status.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-gray-600'
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