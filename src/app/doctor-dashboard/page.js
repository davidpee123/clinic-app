"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Calendar, Clock, LogOut, HeartPulse } from "lucide-react";
import Link from "next/link";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase env vars are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Simple Header
 */
const Header = ({ user, onSignOut }) => (
    <div className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6" />
            <div>
                <div className="text-sm">Doctor Dashboard</div>
                <div className="text-xs text-blue-200">{user?.email}</div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="text-sm hidden sm:block">
                {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </div>
            <button
                onClick={onSignOut}
                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-2"
            >
                <LogOut className="w-4 h-4" />
                Sign out
            </button>
        </div>
    </div>
);

/**
 * Login component (magic link)
 */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // success → session will automatically update via onAuthStateChange
        } catch (err) {
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };


    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Doctor Login</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your login credentials to access your dashboard.
        </p>

        <form onSubmit={signIn} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>

    );
}

/**
 * Appointment Row / Card
 */
const AppointmentRow = ({ appt, onDelete }) => {
    const timeString = appt.appointment_time ? new Date(appt.appointment_time).toLocaleString() : "N/A";
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-lg font-semibold">{appt.patient_name || "Unknown patient"}</div>
                    <div className="text-sm text-gray-500">{appt.reason_for_visit || appt.status || "—"}</div>
                    <div className="text-xs text-gray-400 mt-1">{appt.doctor_name || ""}</div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="font-medium">{timeString}</div>
                    <div className="text-xs text-gray-400">{appt.duration_minutes ? `${appt.duration_minutes} mins` : ""}</div>
                </div>

                <button
                    onClick={() => onDelete(appt.id)}
                    className="text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded hover:bg-red-50"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

/**
 * Main Dashboard page/component
 */
export default function DoctorDashboardPage() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState(null);
    const [realtimeChannel, setRealtimeChannel] = useState(null);

    // Auth listener & initial session
    useEffect(() => {
        let mounted = true;

        async function init() {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);

            // Listen to auth changes (sign in/out) so UI updates
            const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session ?? null);
                setUser(session?.user ?? null);
            });

            return () => {
                authListener.subscription.unsubscribe();
            };
        }

        init();

        return () => { mounted = false; };
    }, []);

    // Set doctorId when user available
    useEffect(() => {
        if (!user) {
            setDoctorId(null);
            return;
        }
        // by default we assume doctor_id equals user.id
        setDoctorId(user.id);
    }, [user]);

    // Fetch appointments for this doctor
    const fetchAppointments = useCallback(async (did) => {
        if (!did) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("appointments")
                .select("*")
                .eq("doctor_id", did)
                .order("appointment_time", { ascending: true });

            if (error) throw error;
            // Normalize times to JS Date string for the UI (supabase returns ISO strings for timestamptz)
            setAppointments(data || []);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Subscribe to realtime updates for this doctor's appointments
    useEffect(() => {
        if (!doctorId) return;

        // Clean up any previous channel
        if (realtimeChannel) {
            try {
                realtimeChannel.unsubscribe();
            } catch (e) { /* ignore */ }
            setRealtimeChannel(null);
        }

        // Create realtime channel scoped to appointments for this doctor.
        // We subscribe to all insert/update/delete events and then refetch or apply change locally.
        const channel = supabase
            .channel(`public:appointments:doctor=${doctorId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${doctorId}` },
                (payload) => {
                    // Handle real-time events: INSERT/UPDATE/DELETE
                    // You can optimize by patching state instead of refetching — keep it simple and refetch.
                    console.log("realtime payload", payload);
                    fetchAppointments(doctorId);
                }
            )
            .subscribe((status) => {
                console.log("realtime status", status);
            });

        setRealtimeChannel(channel);

        // initial fetch
        fetchAppointments(doctorId);

        return () => {
            try {
                channel.unsubscribe();
            } catch (e) {
                /* ignore */
            }
            setRealtimeChannel(null);
        };
    }, [doctorId, fetchAppointments]);

    // Delete appointment
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        try {
            const { error } = await supabase
                .from("appointments")
                .delete()
                .eq("id", id);
            if (error) throw error;
            // optimistic update: remove locally
            setAppointments((prev) => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete appointment. Check console for details.");
        }
    };

    // Sign-out
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setAppointments([]);
        setUser(null);
        setSession(null);
    };

    // If not logged in, show login
    if (!user) {
        return <Login onLoginStart={() => { }} />;
    }

    // Logged-in UI
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header user={user} onSignOut={handleSignOut} />

            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Welcome, {user.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <div className="text-sm text-gray-500">Upcoming Appointments</div>
                        <div className="text-2xl font-bold mt-2">{appointments.length}</div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <div className="text-sm text-gray-500">Next Appointment</div>
                        <div className="text-lg font-semibold mt-2">{appointments[0]?.patient_name ?? "None"}</div>
                        <div className="text-xs text-gray-400">{appointments[0]?.appointment_time ? new Date(appointments[0].appointment_time).toLocaleString() : ""}</div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="text-2xl font-bold mt-2">Active</div>
                    </div>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Upcoming Consultations</h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No appointments scheduled for now.</div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map(appt => (
                                <AppointmentRow key={appt.id} appt={appt} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
