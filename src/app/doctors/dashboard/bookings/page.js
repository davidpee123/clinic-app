// DashboardHome.jsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ClockIcon,
  ChevronDownIcon, // 👈 NEW: For the dropdown arrow
  ChevronUpIcon,   // 👈 NEW: For the collapse arrow
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

// Utility function for clean time display
const formatTime = (time) => {
  // Check if time is a valid date string before formatting
  const date = new Date(time);
  return isNaN(date) ? 'N/A' : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Utility function for clean date display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}


export default function DashboardHome() {
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 🎯 NEW STATE: Tracks the ID of the currently expanded appointment card
  const [expandedApptId, setExpandedApptId] = useState(null); 
  
  // 🎯 NEW FUNCTION: Toggles the expanded state for a given ID
  const toggleExpansion = (apptId) => {
    setExpandedApptId(expandedApptId === apptId ? null : apptId);
  };
  
  // ... (useEffect for loadData remains the same) ...
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1️⃣ Get logged-in user (same as before)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          setLoading(false);
          return;
      }

      setDoctorId(user.id);

      // 2️⃣ FETCH TODAY's APPOINTMENTS from your backend API route
      // NOTE: Ensure your /api/get-appointments route is secured and filters by doctor_id
      const res = await fetch("/api/get-appointments", {
        method: "GET",
        cache: "no-store"
      });

      const result = await res.json();

      if (res.ok) {
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
      
      // 4️⃣ FETCH TOTAL BOOKINGS COUNT (All appointments, not just today's)
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
  }, []); 

  // --- STAT CARD COMPONENT (for reusable, clean code) ---
  const StatCard = ({ title, value, icon: Icon, colorClass, link }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <Icon className={`h-7 w-7 ${colorClass}`} />
      </div>

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

      {/* Stats row */}
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

      {/* Today’s schedule section */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Today's Appointments</h3>

      {/* Appointment Card Container */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

        {/* ... Loading and Empty State (remains the same) ... */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-xl font-semibold text-gray-900">
              You're All Clear
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              No appointments are currently scheduled for today.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map((appt) => {
              const isExpanded = appt.id === expandedApptId;
              const CollapseIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;

              return (
                <li key={appt.id}>
                  {/* --- Header Row (Always visible and clickable) --- */}
                  <div
                    className="flex justify-between items-center py-4 px-2 -mx-2 cursor-pointer hover:bg-gray-50 transition duration-150 rounded-lg"
                    onClick={() => toggleExpansion(appt.id)} // 🎯 CLICK HANDLER
                  >
                    <div className="flex items-center space-x-4">
                      {/* Avatar/Initial Circle */}
                      <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                        {appt.patient_name ? appt.patient_name[0] : 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{appt.patient_name || 'Patient Name'}</p>
                        {/* Use the service_name field from your API payload */}
                        <p className="text-sm text-gray-500">{appt.service_name || 'Online Consultation'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Time Display */}
                      <span className="font-mono text-base text-gray-700">
                        <ClockIcon className="h-4 w-4 inline mr-1 text-gray-400" />
                        {formatTime(appt.appointment_time)}
                      </span>
                      {/* Expansion Toggle Icon */}
                      <CollapseIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    </div>
                  </div>

                  {/* --- Expanded Details Section (Conditionally rendered) --- */}
                  {isExpanded && (
                    <div className="p-4 ml-14 border-l border-b border-gray-100 bg-gray-50/50 rounded-b-lg mb-2 transition-all duration-300">
                      <h4 className="text-base font-semibold text-gray-800 mb-3">Patient Contact Information:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        
                        {/* Email */}
                        <DetailItem 
                            Icon={EnvelopeIcon} 
                            label="Email" 
                            value={appt.patient_email || 'N/A'} 
                            link={`mailto:${appt.patient_email}`}
                        />
                        
                        {/* Phone Number */}
                        <DetailItem 
                            Icon={PhoneIcon} 
                            label="Phone" 
                            value={appt.patient_phone || 'N/A'} 
                            link={`tel:${appt.patient_phone}`}
                        />
                        
                        {/* Full Date */}
                        <DetailItem 
                            Icon={CalendarIcon} 
                            label="Date" 
                            value={formatDate(appt.start_time)} 
                        />
                        
                        {/* Service Type */}
                        <DetailItem 
                            Icon={TagIcon} 
                            label="Type" 
                            value={appt.appointment_type || 'General'} 
                        />
                      </div>
                      
                      {/* Reason/Notes */}
                      {(appt.notes || appt.reason_for_visit) && (
                         <div className="mt-4 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">Reason for Visit:</p>
                            <p className="text-sm text-gray-700 italic">
                                {appt.notes || appt.reason_for_visit || 'Patient did not provide notes.'}
                            </p>
                        </div>
                      )}
                      
                       {/* Action Button: Start Video Call */}
                        {appt.video_link && (
                            <a 
                                href={appt.video_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" /> Start Consultation
                            </a>
                        )}
                        
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// --- NEW HELPER COMPONENT ---
const DetailItem = ({ Icon, label, value, link }) => (
    <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div>
            <span className="text-xs font-medium text-gray-500 block">{label}</span>
            {link ? (
                <a href={link} className="font-semibold text-gray-800 hover:text-blue-600">
                    {value}
                </a>
            ) : (
                <span className="font-semibold text-gray-800">
                    {value}
                </span>
            )}
        </div>
    </div>
);