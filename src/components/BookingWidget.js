"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Function to generate the next 7 days (moved outside to be a utility function)
const getUpcomingDays = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const upcoming = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    upcoming.push({
      day: days[date.getDay()],
      date: `${months[date.getMonth()]} ${date.getDate()}`,
      fullDate: date.toISOString().split("T")[0] // YYYY-MM-DD
    });
  }
  return upcoming;
};

const BookingWidget = ({ doctor }) => {
  const router = useRouter();

  // FIX 1: Use useMemo to ensure upcomingDays is only created once
  const upcomingDays = useMemo(() => getUpcomingDays(), []);

  // Using a fallback ID for demonstration if doctor is null
  const doctorId = doctor?.id || "doc-123";

  const [appointmentType, setAppointmentType] = useState("In person");
  const [selectedDate, setSelectedDate] = useState(upcomingDays[0].date);
  const [selectedTime, setSelectedTime] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find the full date for the currently selected display date
  const selectedFullDate = useMemo(() => {
    return upcomingDays.find((d) => d.date === selectedDate)?.fullDate || upcomingDays[0].fullDate;
  }, [selectedDate, upcomingDays]); // Depend on selectedDate and the stable upcomingDays

  // Fetch availability (Placeholder logic)
  // FIX 2: Remove upcomingDays from the dependency array as it is now stable
  const fetchAvailability = useCallback(async (drId, fullDate) => {
    if (!drId || !fullDate) return;

    setIsLoading(true);
    setAvailableTimes([]);
    setSelectedTime(null);

    // --- Mocking API Call to /api/get-appointments ---
    try {
      // MOCK DATA for demonstration
      // Note: We access the fullDate directly from the argument, not upcomingDays
      const isSecondDay = fullDate === upcomingDays[1].fullDate;
      const mockBookedTimes = isSecondDay ? ["11:00", "15:00"] : ["09:00"];
      const allTimes = ["08:00", "09:00", "10:00", "11:00", "13:00", "15:00"];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove booked times
      const freeTimes = allTimes.filter((t) => !mockBookedTimes.includes(t));
      setAvailableTimes(freeTimes);

    } catch (err) {
      console.error("Network error or API error:", err);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
    // --- End Mock ---
  }, [upcomingDays]); // We keep it here only because the MOCK data uses it, 
  // but in a real API call, it would ONLY need to depend on nothing or stable functions/props.

  // FIX 3: The useEffect dependency array is now correct.
  // It runs only when doctorId, selectedFullDate, or the fetchAvailability function (which is now stable) changes.
  useEffect(() => {
    // We only fetch availability if we have the necessary data
    if (doctorId && selectedFullDate) {
      fetchAvailability(doctorId, selectedFullDate);
    }
  }, [doctorId, selectedFullDate, fetchAvailability]);

  // Convert 08:00 => 8:00 AM for UI
  const convertToDisplay = (time) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    // Remove leading zero for single-digit hours (e.g., 08:00 -> 8:00 AM)
    return `${hour}:${m}${ampm}`;
  };

  // Continue booking
  const handleContinueBooking = () => {
    if (!selectedTime) {
      // In a real app, use a toast/modal instead of console error
      console.error("Please select a time slot first.");
      return;
    }

    const selectedIsoTime = selectedTime;
    const typeForUrl = appointmentType.replace(" ", "-").toLowerCase();

    const destination = `/final-booking?type=${typeForUrl}&date=${selectedFullDate}&time=${selectedIsoTime}&doctorId=${doctorId}`;
    router.push(destination);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-100">

     
      <h2 className="text-xl font-extrabold mb-4 text-gray-800 border-b pb-3">
        {/* Change .name to .full_name */}
        Book Appointment with {doctor?.full_name ? `Dr. ${doctor.full_name}` : "your Specialist"}
      </h2>
      {/* Appointment Type */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Choose the appointment type</p>

        <div className="flex flex-wrap gap-4"> {/* Use flex-wrap for mobile */}
          <label className="inline-flex items-center cursor-pointer p-2 rounded-lg transition-colors hover:bg-blue-50">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600 border-blue-600 focus:ring-blue-500"
              name="appointmentType"
              checked={appointmentType === "In person"}
              onChange={() => { setAppointmentType("In person"); setSelectedTime(null); }}
            />
            <span className="ml-2 text-gray-700 text-sm font-medium">In person</span>
          </label>

          <label className="inline-flex items-center cursor-pointer p-2 rounded-lg transition-colors hover:bg-blue-50">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600 border-blue-600 focus:ring-blue-500"
              name="appointmentType"
              checked={appointmentType === "Video visit"}
              onChange={() => { setAppointmentType("Video visit"); setSelectedTime(null); }}
            />
            <span className="ml-2 text-gray-700 text-sm font-medium">Video visit</span>
          </label>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Select an available date</p>

        {/* Calendar Navigation and Days Container */}
        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          {/* Disabled Left Button */}
          <button
            disabled
            className="p-3 text-gray-400 bg-gray-100 cursor-not-allowed hidden sm:block"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {/* Date Scroller (Full Width on Mobile) */}
          <div className="flex flex-grow space-x-2 overflow-x-scroll p-2 scrollbar-hide">
            {upcomingDays.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center flex-shrink-0 p-3 rounded-lg cursor-pointer w-16 h-16 transition-all duration-200 border-2 ${item.date === selectedDate
                  ? "bg-blue-600 text-white border-blue-700 shadow-lg"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
              >
                <span className="text-xs font-medium uppercase">{item.day}</span>
                <span className="text-lg font-extrabold">{item.date.split(" ")[1]}</span>
              </div>
            ))}
          </div>

          {/* Disabled Right Button */}
          <button
            disabled
            className="p-3 text-gray-400 bg-gray-100 cursor-not-allowed hidden sm:block"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Available Times for {selectedDate}</p>

        {isLoading ? (
          <div className="text-center py-6 bg-blue-50 rounded-xl">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-700 mt-3 font-medium">Checking availability...</p>
          </div>
        ) : availableTimes.length === 0 ? (
          <div className="text-center py-6 bg-red-50 rounded-xl text-red-600 font-medium text-sm border border-red-200">
            No slots available on this date. Please select another.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 max-h-52 overflow-y-auto pr-1">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 border rounded-full text-base font-medium transition-all duration-150 shadow-sm ${selectedTime === time
                  ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {convertToDisplay(time)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        className={`w-full mt-8 py-3.5 font-extrabold text-lg rounded-xl transition duration-200 shadow-lg transform hover:scale-[1.01] ${selectedTime
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        onClick={handleContinueBooking}
        disabled={!selectedTime || isLoading}
      >
        Continue Booking
      </button>

    </div>
  );
};

export default BookingWidget;