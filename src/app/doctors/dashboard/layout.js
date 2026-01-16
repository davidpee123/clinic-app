"use client";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Squares2X2Icon, TableCellsIcon, CalendarIcon, 
  UserIcon, Cog6ToothIcon, CameraIcon
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const fileInputRef = useRef(null);

  // 1. State for doctor information
  const [doctorInfo, setDoctorInfo] = useState({
    full_name: "Loading...",
    specialization: "Healthcare Professional",
    avatar_url: "/doctor-avatar.jpg",
  });

 useEffect(() => {
  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No user found in auth session.");
      setDoctorInfo(prev => ({ ...prev, full_name: "Not Logged In" }));
      return;
    }

    // DEBUG LOG: See what ID you are actually searching for
    console.log("Logged in Auth ID:", user.id);

    const { data, error } = await supabase
      .from('doctors')
      .select('full_name, specialization, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      console.error("Error Details:", error.details);
      setDoctorInfo(prev => ({ ...prev, full_name: "ID Mismatch or Error" }));
      return;
    }

    if (data) {
      setDoctorInfo({
        full_name: data.full_name,
        specialization: data.specialization,
        avatar_url: data.avatar_url || "/doctor-avatar.jpg",
      });
    }
  }
  getProfile();
}, [supabase]);

  const navItems = [
    { label: "Dashboard", href: "/doctors/dashboard", icon: Squares2X2Icon },
    { label: "Appointments", href: "/doctors/dashboard/appointments", icon: TableCellsIcon },
    { label: "Calendar", href: "/doctors/dashboard/calendar", icon: CalendarIcon },
    { label: "Profile", href: "/doctors/dashboard/profile", icon: UserIcon },
    { label: "Settings", href: "/doctors/dashboard/settings", icon: Cog6ToothIcon },
  ];

  // Handle local image preview (Note: This doesn't save to DB yet)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDoctorInfo(prev => ({ ...prev, avatar_url: url }));
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FE] overflow-hidden fixed inset-0">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#193cb8] text-white flex flex-col p-6 shrink-0 shadow-xl">
        <div className="flex flex-col items-center mb-10">
          {/* PROFILE IMAGE SECTION */}
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="group relative w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden mb-4 cursor-pointer hover:border-white/50 transition-all"
          >
            <img 
              src={doctorInfo.avatar_url} 
              alt={doctorInfo.full_name} 
              className="w-full h-full object-cover group-hover:opacity-75" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          {/* DYNAMIC TEXT */}
          <h2 className="font-bold text-xl text-center leading-tight">
            {doctorInfo.full_name}
          </h2>
          <p className="text-white/60 text-sm italic">
            {doctorInfo.specialization}
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                pathname === item.href 
                ? "bg-white/20 text-white shadow-sm font-bold" 
                : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}