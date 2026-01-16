"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  CalendarIcon, MapPinIcon,
  CheckCircleIcon, XCircleIcon
} from "@heroicons/react/24/outline";

const TABS = ["All", "Today", "Requests", "Confirmed", "Rejected", "Attended"];

export default function AppointmentsList() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState("Today");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let query = supabase.from("appointments").select("*");

        // NEW LOGIC: Only filter if the active tab is NOT "All"
        if (activeTab !== "All") {
          query = query.eq("status", activeTab.toLowerCase());
        }

        const { data, error } = await query.order("appointment_time", { ascending: true });

        if (error) {
          console.error("Supabase Error:", error.message);
        } else {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, supabase]);

  // 2. Function to update status (Action buttons)
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      // Refresh list locally
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-500">Manage your patient schedules and requests</p>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? "text-[#7B61FF]" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#7B61FF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- Filter Bar (UI Maintained) --- */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</label>
          <div className="relative">
            <input type="text" placeholder="Select Date" readOnly className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 w-44 focus:outline-none" />
            <CalendarIcon className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</label>
          <div className="relative">
            <input type="text" placeholder="City" readOnly className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 w-44 focus:outline-none" />
            <MapPinIcon className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <button className="ml-auto bg-[#7B61FF] text-white px-8 py-2 rounded-lg font-bold text-sm">Clear</button>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-[11px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50 bg-gray-50/50">
            <tr>
              <th className="px-8 py-5">Patient Name</th>
              <th className="py-5">Time</th>
              <th className="py-5">Contact</th>
              <th className="py-5 text-center px-8">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400 text-sm">Loading appointments...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400 text-sm">No appointments found for {activeTab}.</td></tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-[#7B61FF] font-bold">
                        {appt.patient_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{appt.patient_name}</p>
                        <span className="text-[10px] text-gray-400 font-mono">#{appt.id.toString().slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 text-sm font-bold text-gray-700">{appt.time}</td>
                  <td className="py-5 text-sm text-gray-600">{appt.phone || "N/A"}</td>
                  <td className="py-5 px-8">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateStatus(appt.id, 'attended')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-100 text-green-600 text-[10px] font-bold uppercase hover:bg-green-50"
                      >
                        <CheckCircleIcon className="h-3.5 w-3.5" /> Attended
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, 'rejected')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50"
                      >
                        <XCircleIcon className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}