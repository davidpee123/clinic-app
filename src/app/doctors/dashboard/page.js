"use client";

import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ClockIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

const formatTime = (time) =>
  time?.slice(0, 5); // HH:MM

export default function DashboardHome() {
  const supabase = createClientComponentClient();

  const [appointments, setAppointments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [messages] = useState([1, 2]); // mock
  const [loading, setLoading] = useState(true);

  // Today date (YYYY-MM-DD)
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        console.error("Not authenticated");
        setLoading(false);
        return;
      }

      // Fetch today's appointments for this doctor
      const { data, error: apptError } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          patients (
            full_name,
            email,
            phone
          )
        `)
        .eq("doctor_id", user.id)
        .eq("appointment_date", today)
        .order("appointment_time", { ascending: true });

      if (apptError) {
        console.error(apptError.message);
        setAppointments([]);
      } else {
        setAppointments(data || []);
      }

      // Count all bookings
      const { count } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", user.id);

      setTotalBookings(count || 0);
      setLoading(false);
    }

    loadData();
  }, [supabase, today]);

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <Icon className={`h-7 w-7 ${colorClass}`} />
      </div>
      <p className="text-5xl font-extrabold text-gray-900 mt-2">
        {loading ? "..." : value}
      </p>
    </div>
  );

  return (
    <div className="py-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
        Doctor Portal
      </h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Today's Schedule"
          value={appointments.length}
          icon={ClockIcon}
          colorClass="text-teal-500"
        />
        <StatCard
          title="Unread Messages"
          value={messages.length}
          icon={ChatBubbleLeftRightIcon}
          colorClass="text-indigo-500"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={BookmarkIcon}
          colorClass="text-green-500"
        />
      </div>

      {/* Appointments */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        Today's Appointments
      </h3>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-xl font-semibold text-gray-900">
              You're All Clear
            </h4>
            <p className="text-sm">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="py-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === appt.id ? null : appt.id)
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                      {appt.patients.full_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appt.patients.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appt.patients.email}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-gray-700">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    {formatTime(appt.appointment_time)}
                  </span>
                </div>

                {/* Expandable details */}
                {expandedId === appt.id && (
                  <div className="mt-4 ml-14 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <p>
                      <strong>Phone:</strong> {appt.patients.phone}
                    </p>
                    <p>
                      <strong>Date:</strong> {appt.appointment_date}
                    </p>
                    <p>
                      <strong>Status:</strong> {appt.status}
                    </p>

                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
