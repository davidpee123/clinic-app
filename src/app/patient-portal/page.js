"use client";

import { useState, useEffect } from "react";
import { CalendarDays, ClipboardList, HeartPulse, Stethoscope, Plus } from "lucide-react";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch user's appointments from backend
    async function fetchAppointments() {
      const res = await fetch("/api/get-appointments");
      const data = await res.json();
      if (res.ok) setAppointments(data.appointments);
    }
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Hi, <span className="text-blue-600">Josh Emeka Peter</span> 👋
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-500 text-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Consultation Requests</h2>
              <ClipboardList className="w-6 h-6 opacity-80" />
            </div>
            <p className="text-3xl font-bold mt-3">{appointments.length}</p>
          </div>

          <div className="bg-orange-400 text-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending Requests</h2>
              <CalendarDays className="w-6 h-6 opacity-80" />
            </div>
            <p className="text-3xl font-bold mt-3">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
          </div>

          <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Total Consultations</h2>
              <Stethoscope className="w-6 h-6 opacity-80" />
            </div>
            <p className="text-3xl font-bold mt-3">{appointments.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium shadow">
            <HeartPulse className="w-5 h-5" /> Urgent Care
          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow">
            <Plus className="w-5 h-5" /> Book Now
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming appointments yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {appointments.map((a) => (
                <div key={a.id} className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
                  <h3 className="text-gray-800 font-semibold mb-1">{a.doctor_name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(a.appointment_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    Status: {a.status}
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
