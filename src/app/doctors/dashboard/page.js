"use client";
import { useState, useEffect, cloneElement } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  ClipboardDocumentCheckIcon, XCircleIcon, CheckBadgeIcon, UserIcon,
  MagnifyingGlassIcon, PlusIcon, ClockIcon, PhoneIcon, ChatBubbleLeftRightIcon,
  ChevronDownIcon, ChevronUpIcon
} from "@heroicons/react/24/outline";

export default function DashboardHome() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({ requests: 0, confirmed: 0, rejected: 0, attended: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // 1. Fetch Data Function
  const getDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const doctorId = user.id;

    // Fetch Stats
    const { data: allData } = await supabase
      .from('appointments')
      .select('status')
      .eq('doctor_id', doctorId);

    if (allData) {
      const counts = allData.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});
      setStats({
        requests: counts.pending || 0,
        confirmed: counts.confirmed || 0,
        rejected: counts.rejected || 0,
        attended: allData.length || 0
      });
    }

    // Fetch Today's Appointments
    const { data: list } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('time', { ascending: true });
    
    setAppointments(list || []);
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, [supabase]);

  // 2. LIVE UPDATE HANDLER
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      // Refresh the local data to show changes immediately
      await getDashboardData();
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Failed to update appointment. Please try again.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ClipboardDocumentCheckIcon />} label="New Requests" value={stats.requests} color="text-yellow-500" />
        <StatCard icon={<CheckBadgeIcon />} label="Confirmed" value={stats.confirmed} color="text-green-500" />
        <StatCard icon={<XCircleIcon />} label="Canceled" value={stats.rejected} color="text-red-500" />
        <StatCard icon={<UserIcon />} label="Total Patients" value={stats.attended} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* TODAY'S APPOINTMENTS LIST */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Today's Schedule</h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#193cb8]"></div></div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-10 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">No appointments scheduled for today.</p>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-gray-200">
                  <div className="p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#193cb8] font-bold text-xl uppercase">
                        {appt.patient_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 text-lg">{appt.patient_name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-1 font-medium">
                          <ClockIcon className="h-4 w-4" /> {appt.time} • {appt.reason || 'General Checkup'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {appt.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(appt.id, 'rejected')}
                            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      <button onClick={() => toggleExpand(appt.id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100">
                        {expandedId === appt.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE SECTION */}
                  {expandedId === appt.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Medical Notes</p>
                          <p className="text-sm text-gray-600 font-medium leading-relaxed">
                            {appt.notes || "No additional notes provided by the patient."}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 items-end justify-end">
                          <a href={`https://wa.me/${appt.phone}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold text-xs shadow-sm hover:scale-105 transition-transform">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" /> WhatsApp
                          </a>
                          <a href={`tel:${appt.phone}`} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl font-bold text-xs shadow-sm hover:scale-105 transition-transform">
                            <PhoneIcon className="h-4 w-4" /> Call Patient
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-gray-800 text-xl tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-[#f8f9ff] rounded-2xl hover:bg-[#eef1ff] transition-all group">
                <div className="bg-white p-2 rounded-xl shadow-sm"><PlusIcon className="h-5 w-5 text-[#193cb8]" /></div>
                <span className="font-bold text-gray-700">Add Appointment</span>
              </button>
              <div className="relative">
                <input type="text" placeholder="Search Patient..." className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#193cb8]/20 transition-all font-bold text-sm outline-none" />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#193cb8] to-[#4e6bf2] rounded-[2.5rem] p-8 text-white shadow-xl">
            <h3 className="font-bold text-lg">Weekly Volume</h3>
            <div className="mt-6 h-24 flex items-end gap-2">
               {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/20 rounded-t-lg hover:bg-white/40 transition-all"></div>
               ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-white/50 uppercase">
              <span>Mon</span><span>Wed</span><span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
      <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-white transition-colors ${color}`}>
        {cloneElement(icon, { className: "h-7 w-7" })}
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-gray-800 leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">{label}</p>
      </div>
    </div>
  );
}