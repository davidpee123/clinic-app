// src/components/DashboardHome.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ClockIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

// Format time nicely
const formatTime = (time) =>
  new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export default function DashboardHome() {
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  // Compute UTC boundaries for today
  const { todayStart, todayEnd } = useMemo(() => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return { todayStart: start, todayEnd: end };
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1️⃣ Get logged-in doctor
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        console.error("User not authenticated", userError);
        setLoading(false);
        return;
      }

      setDoctorId(user.id);

      // --- Mock API Call ---
      // Replace with your actual fetch logic once API is ready
      const mockAppointments = [
        { id: 1, patient_name: "Janet Kowal", start_time: new Date(Date.now() + 3600000).toISOString(), phone_number: "555-1234", video_link: "https://zoom.us/j/123456789", note: "Chronic headaches" },
        { id: 2, patient_name: "Ahmed Hassan", start_time: new Date(Date.now() + 7200000).toISOString(), email: "ahmed@example.com", video_link: null, note: null },
      ];
      setAppointments(mockAppointments);
      // --- End Mock ---


      // 4️⃣ Total bookings count
      const { count, error: countError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", user.id);

      if (countError) console.error("Error fetching total bookings:", countError.message);
      setTotalBookings(count || 0);

      // 5️⃣ Mock unread messages count
      setMessages([1, 2]);

      setLoading(false);
    }

    loadData();
  }, [todayStart, todayEnd]);

  // --- StatCard Component ---
  const StatCard = ({ title, value, icon: Icon, colorClass, link }) => (
    <a href={link} className="block"> {/* Wrapped with an anchor tag for clickability */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <Icon className={`h-7 w-7 ${colorClass}`} />
        </div>
        <p className="text-5xl font-extrabold text-gray-900 mt-2">
          {loading ? "..." : value}
        </p>
        {/* Removed duplicate link since the whole card is linked */}
      </div>
    </a>
  );

  return (
    <div className="py-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Doctor Portal
      </h2>

      {/* Overview Stats (Responsive: 1-col on mobile, 3-col on desktop) */}
      {/* Uses MD breakpoint, which is great */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
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
          value={totalBookings}
          icon={BookmarkIcon}
          colorClass="text-green-500"
          link="/doctors/bookings"
        />
      </div>

      {/* Today's Appointments */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Today's Appointments</h3>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-xl font-semibold text-gray-900">You're All Clear</h4>
            <p className="mt-1 text-sm text-gray-500">
              No appointments are currently scheduled for today.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-2 -mx-2 hover:bg-gray-50 transition duration-150 rounded-lg"
              >
                <div className="flex items-start space-x-4 mb-2 sm:mb-0 flex-grow">
                  <div className="h-10 w-10 flex-shrink-0 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {appt.patient_name ? appt.patient_name[0] : "P"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appt.patient_name || "Patient Name"}
                    </p>
                    {/* 🚨 FIX: Used flex-wrap to ensure contact info and note stack cleanly */}
                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      {appt.phone_number && <span>📞 {appt.phone_number}</span>}
                      {!appt.phone_number && appt.email && (
                        <span>📧 {appt.email}</span>
                      )}
                      {appt.note && (
                        <span className="text-xs text-gray-600 italic mt-1 sm:mt-0">Note: {appt.note}</span>
                      )}
                      {!appt.note && (
                        <span className="text-sm text-gray-500">
                          {appt.video_link ? "Online Consultation" : "Physical Visit"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time and Status/Link (Moved to the end of the mobile stack) */}
                <div className="flex justify-between w-full sm:w-auto sm:flex-col sm:items-end mt-2 sm:mt-0">
                  <span className="font-mono text-base text-gray-700">
                    <ClockIcon className="h-4 w-4 inline mr-1 text-gray-400" />
                    {formatTime(appt.start_time)}
                  </span>

                  {appt.video_link ? (
                    <a
                      href={appt.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white hover:bg-blue-600 transition"
                    >
                      <VideoCameraIcon className="h-3 w-3 mr-1" />
                      Join Video Call
                    </a>
                  ) : (
                    <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
                      Confirmed
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}