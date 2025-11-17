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

      // 2️⃣ Fetch today’s appointments from backend API
      const res = await fetch(
        `/api/get-appointments?start=${todayStart.toISOString()}&end=${todayEnd.toISOString()}`,
        { method: "GET", cache: "no-store" }
      );

      const result = await res.json();

      if (res.ok) {
        setAppointments(result.appointments || []);
      } else {
        console.error("Failed to fetch appointments", result.message);
        setAppointments([]);
      }

    
      // 4️⃣ Total bookings count
      const { count, error: countError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", user.id);

      if (countError) console.error("Error fetching total bookings:", countError.message);
      setTotalBookings(count || 0);

      setLoading(false);
    }

    loadData();
  }, [todayStart, todayEnd]);

  // --- StatCard Component ---
  const StatCard = ({ title, value, icon: Icon, colorClass, link }) => (
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
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Doctor Portal
      </h2>

      {/* Overview Stats */}
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
          value={totalBookings}
          icon={BookmarkIcon}
          colorClass="text-green-500"
          link="/doctors/bookings"
        />
      </div>

      {/* Today's Appointments */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Today's Appointments</h3>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
                className="flex justify-between items-center py-4 px-2 -mx-2 hover:bg-gray-50 transition duration-150 rounded-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 flex-shrink-0 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {appt.patient_name ? appt.patient_name[0] : "P"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appt.patient_name || "Patient Name"}
                    </p>
                    <div className="text-sm text-gray-500 mt-1">
                      {appt.phone_number && <span className="mr-3">📞 {appt.phone_number}</span>}
                      {!appt.phone_number && appt.email && (
                        <span className="mr-3">📧 {appt.email}</span>
                      )}
                      {appt.note && (
                        <span className="text-xs text-gray-600 italic">Note: {appt.note}</span>
                      )}
                      {!appt.note && (
                        <span className="text-sm text-gray-500">
                          {appt.video_link ? "Online Consultation" : "Physical Visit"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
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
