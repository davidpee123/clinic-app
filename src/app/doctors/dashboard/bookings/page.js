// DashboardHome.jsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// Utility function for clean time display
const formatTime = (time) =>
  new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });


export default function DashboardHome() {
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0); // 👈 NEW STATE FOR TOTAL BOOKINGS
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1️⃣ Get logged-in user (same as before)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setDoctorId(user.id);

      // 2️⃣ FETCH TODAY's APPOINTMENTS from your backend API route
      const res = await fetch("/api/get-appointments", {
        method: "GET",
        cache: "no-store"
      });

      const result = await res.json();

      if (res.ok) {
        // This is assumed to contain only TODAY's appointments as per the API route name/use
        setAppointments(result.appointments || []); 
      } else {
        console.error("Failed to load appointments", result.message);
        setAppointments([]);
      }

      // 3️⃣ Fetch unread messages from Supabase directly
      const { data: msgs, error: msgError } = await supabase
        .from("messages")
        .select("id")
        .eq("receiver_id", user.id)
        .eq("is_read", false);

      if (msgError) {
          console.error("Error fetching messages:", msgError.message);
      }
      setMessages(msgs || []);
      
      // 4️⃣ FETCH TOTAL BOOKINGS COUNT (All appointments, not just today's) 👈 NEW QUERY
      const { count: total, error: countError } = await supabase
        .from("appointments")
        .select("*", { count: 'exact', head: true }) // Request only the count
        .eq("doctor_id", user.id);

      if (countError) {
          console.error("Error fetching total bookings:", countError.message);
      }
      setTotalBookings(total || 0);

      setLoading(false);
    }

    loadData();
  }, []); // Run only once on mount

// ... rest of the component (StatCard and return) ...

  // --- STAT CARD COMPONENT (for reusable, clean code) ---
  const StatCard = ({ title, value, icon: Icon, colorClass, link }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <Icon className={`h-7 w-7 ${colorClass}`} />
      </div>

      {/* Renders '...' while loading, then the final value */}
      <p className="text-5xl font-extrabold text-gray-900 mt-2">
        {loading ? '...' : value}
      </p>

      {link && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <a href={link} className={`text-sm font-medium ${colorClass} hover:opacity-80`}>
            View Details &rarr;
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div>

      {/* Dashboard Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Doctor Portal
      </h2>

      <h3 className="text-xl font-semibold text-gray-700 mb-6">Overview</h3>

      {/* Stats row: Enhanced with StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          title="Today's Schedule"
          value={appointments.length}
          icon={ClockIcon}
          colorClass="text-teal-500"
          link="/doctors/dashboard/schedule"
        />

        <StatCard
          title="Unread Messages"
          value={messages.length}
          icon={ChatBubbleLeftRightIcon}
          colorClass="text-indigo-500"
          link="/doctors/messages"
        />

        <StatCard
          title="Total Bookings"
          value={totalBookings} // 👈 USING THE NEW STATE
          icon={BookmarkIcon}
          colorClass="text-green-500"
          link="/doctors/bookings"
        />
      </div>

      {/* Today’s schedule section */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Today's Appointments</h3>

      {/* Appointment Card Container */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <>
            {/* No Appointments State: Visually engaging placeholder */}
            <div className="text-center py-10 text-gray-500">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-xl font-semibold text-gray-900">
                You're All Clear
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                No appointments are currently scheduled for today.
              </p>
            </div>
          </>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map((appt) => (
              <li key={appt.id} className="flex justify-between items-center py-4 px-2 -mx-2 hover:bg-gray-50 transition duration-150 rounded-lg">
                <div className="flex items-center space-x-4">
                  {/* Avatar/Initial Circle */}
                  <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {appt.patient_name ? appt.patient_name[0] : 'P'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{appt.patient_name || 'Patient Name'}</p>
                    <p className="text-sm text-gray-500">Online Consultation</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {/* Time Display */}
                  <span className="font-mono text-base text-gray-700">
                    <ClockIcon className="h-4 w-4 inline mr-1 text-gray-400" />
                    {/* Note: The appointment time is assumed to be stored in a property named 'appointment_time' 
                        based on the existing code, but ensure this matches the actual property name returned
                        by your /api/get-appointments route. */}
                    {formatTime(appt.appointment_time)} 
                  </span>
                  {/* Status Badge */}
                  <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
                    Confirmed
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}