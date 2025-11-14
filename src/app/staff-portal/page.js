"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function StaffPortalPage() {
  const [staffData, setStaffData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeJson = async (res) => {
    try {
      if (!res.ok) {
        console.error("Fetch error:", res.status, res.statusText);
        return [];
      }

      const text = await res.text();
      try {
        return text ? JSON.parse(text) : [];
      } catch (err) {
        console.error("Failed to parse JSON:", err, text);
        return [];
      }
    } catch (err) {
      console.error("Unexpected fetch error:", err);
      return [];
    }
  };

  async function fetchData() {
    try {
      const [appointmentsRes, patientsRes, queueRes] = await Promise.all([
        fetch("/api/appointments/today"),
        fetch("/api/patients"),
        fetch("/api/get-queue"),
      ]);

      const appointmentsData = await safeJson(appointmentsRes);
      const patientsData = await safeJson(patientsRes);
      const queueData = await safeJson(queueRes);

      // ✅ Since backend now returns arrays directly
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setQueue(Array.isArray(queueData) ? queueData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedStaffData = localStorage.getItem("staffData");
    if (storedStaffData) {
      setStaffData(JSON.parse(storedStaffData));
      fetchData();
    } else {
      console.log("No staff data found. Redirecting to login...");
    }
  }, []);

  // Small utility for queue status
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "waiting":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Waiting</span>;
      case "in-progress":
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
      case "completed":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-gray-600">Loading staff portal...</p>
      </div>
    );
  }

  const todayAppointments = appointments || [];
  const totalPatients = patients.length;
  const waitingInQueue = Array.isArray(queue)
    ? queue.filter((q) => q.status === "waiting").length
    : 0;

  return (
   <>
   < Header />
  
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-800">Total Patients</h2>
          <p className="text-2xl font-bold text-blue-600">{totalPatients}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-800">Today’s Appointments</h2>
          <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-800">Waiting Queue</h2>
          <p className="text-2xl font-bold text-blue-600">{waitingInQueue}</p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Queue</h2>
        {queue.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-700">Patient</th>
                <th className="px-4 py-2 text-left text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{q.patient_Name || "Unknown"}</td>
                  <td className="px-4 py-2">{getStatusBadge(q.status)}</td>
                  <td className="px-4 py-2">{q.check_in_time || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No patients in queue right now.</p>
        )}
      </div>
    </div>
  
</>

  );
}
