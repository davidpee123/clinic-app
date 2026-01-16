"use client";
import { useState } from "react";
import AvailabilityGrid from "@/components/AvailabilityGrid";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";

export default function CalendarPage() {
  // 1. Track the start of the current visible week
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Start on Monday
  );

  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          {/* 2. Dynamic Month and Year Display */}
          <h1 className="text-2xl font-black text-[#193cb8]">
            {format(currentWeekStart, "MMMM dd")}-
            {format(addWeeks(currentWeekStart, 0), "dd, yyyy")}
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Weekly Schedule</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#ff6900] p-1 rounded-xl">
            <button 
              onClick={handlePrevWeek}
              className="px-4 py-2 hover:text-black hover:shadow-sm rounded-lg text-sm font-bold text-white transition-all"
            >
              &larr; Prev
            </button>
            <button 
              onClick={handleNextWeek}
              className="px-4 py-2 hover:text-black hover:shadow-sm rounded-lg text-sm font-bold text-white transition-all"
            >
              Next &rarr;
            </button>
          </div>
          <input 
            type="date" 
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none"
            value={format(currentWeekStart, "yyyy-MM-dd")}
            onChange={(e) => setCurrentWeekStart(startOfWeek(new Date(e.target.value), { weekStartsOn: 1 }))}
          />
        </div>
      </div>
      
      {/* Pass the current week start to the grid */}
      <AvailabilityGrid weekStart={currentWeekStart} />
    </div>
  );
}