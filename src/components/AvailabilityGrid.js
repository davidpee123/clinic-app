"use client";
import { useState } from "react";
import { PencilSquareIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const DAYS = ["Mon 01", "Tue 02", "Wed 03", "Thu 04", "Fri 05", "Sat 06", "Sun 07"];
const TIMES = ["07:30 AM", "08:30 AM", "09:50 AM", "10:00 AM", "12:30 PM", "12:50 PM", "01:50 PM", "02:30 PM"];

export default function AvailabilityGrid() {
  // Initialize all slots as available for demo
  const [availability, setAvailability] = useState({});

  const toggleSlot = (day, time) => {
    const key = `${day}-${time}`;
    setAvailability(prev => ({
      ...prev,
      [key]: !prev[key] // false = Available, true = Not Available
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 w-32">
                Time Slots
              </th>
              {DAYS.map((day) => (
                <th key={day} className="p-6 border-l border-gray-50 bg-gray-50/30">
                  <p className="text-sm font-bold text-gray-800">{day.split(' ')[0]}</p>
                  <p className="text-lg font-black text-gray-900">{day.split(' ')[1]}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-[#193cb8] uppercase">
                    Available <ChevronDownIcon className="h-3 w-3" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time) => (
              <tr key={time} className="border-b border-gray-50">
                <td className="p-6 text-sm font-bold text-gray-500 bg-gray-50/20">
                  {time}
                </td>
                {DAYS.map((day) => {
                  const isNotAvailable = availability[`${day}-${time}`];
                  return (
                    <td key={`${day}-${time}`} className="p-2 border-l border-gray-50">
                      <div 
                        onClick={() => toggleSlot(day, time)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                          isNotAvailable 
                            ? "bg-red-50 border-red-100" 
                            : "bg-blue-50/30 border-blue-100 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${isNotAvailable ? 'text-red-400' : 'text-[#101828]'}`}>
                            Availability
                          </span>
                          <PencilSquareIcon className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-600" />
                        </div>
                        <p className={`text-xs font-bold ${isNotAvailable ? 'text-red-600' : 'text-blue-600'}`}>
                          {isNotAvailable ? "Not available" : "Available"}
                        </p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}