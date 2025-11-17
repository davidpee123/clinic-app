// Topbar.jsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Bell, Settings, LogOut } from "lucide-react"; // Import new icons

export default function Topbar() {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("doctors")
        .select("full_name, profile_image")
        .eq("id", user.id)
        .single();

      setDoctor(data);
    }

    fetchDoctor();
  }, []);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-100">
       
      <h1 className="text-xl font-medium text-gray-800">
        Welcome Back, Dr. {doctor?.full_name?.split(' ')[0] || "..."}!
      </h1>

      <div className="flex items-center gap-4">
        
        {/* Utility Icons */}
        <button 
          className="text-gray-500 hover:text-teal-600 transition duration-150 p-2 rounded-full hover:bg-gray-50 relative"
          title="Notifications"
        >
          <Bell size={20} />
          {/* Example Badge for unread notifications */}
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400" />
        </button>

        <button 
          className="text-gray-500 hover:text-teal-600 transition duration-150 p-2 rounded-full hover:bg-gray-50"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-200 mx-2" />
        
        {/* Profile Dropdown Area */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <p className="text-sm font-semibold text-gray-700">
            {doctor ? doctor.full_name : "Loading..."}
          </p>

          {/* Profile Image Circle */}
          <div className="w-10 h-10 rounded-full bg-[#193cb8] overflow-hidden ring-2 ring-teal-300">
            {doctor?.profile_image ? (
              <img
                src={doctor.profile_image}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              // Fallback initials or icon if no image
              <span className="flex items-center justify-center h-full text-white text-lg font-bold">
                {doctor?.full_name ? doctor.full_name[0] : 'D'}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}