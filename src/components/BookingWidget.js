"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Generate the next 7 days
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
  const upcomingDays = getUpcomingDays();
  const doctorId = doctor?.id || "2";

  const [appointmentType, setAppointmentType] = useState("In person");
  const [selectedDate, setSelectedDate] = useState(upcomingDays[0].date);
  const [selectedTime, setSelectedTime] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedFullDate =
    upcomingDays.find((d) => d.date === selectedDate)?.fullDate || upcomingDays[0].fullDate;

  // Fetch availability
  const fetchAvailability = useCallback(async (drId, fullDate) => {
    if (!drId || !fullDate) return;

    setIsLoading(true);
    setAvailableTimes([]);
    setSelectedTime(null);

    try {
      const response = await fetch(`/api/get-appointments?doctorId=${drId}&date=${fullDate}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data.message);
        setAvailableTimes([]);
        return;
      }

      // system time slots
      const allTimes = ["08:00", "09:00", "10:00", "11:00", "13:00", "15:00"];

      // Extract booked times
      const bookedTimes = data.appointments
        .filter((a) => a.doctor_id === drId && a.start_time.startsWith(fullDate))
        .map((a) => a.start_time.substring(11, 16)); // HH:MM

      // Remove booked
      const freeTimes = allTimes.filter((t) => !bookedTimes.includes(t));
      setAvailableTimes(freeTimes);
    } catch (err) {
      console.error("Network error:", err);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability(doctorId, selectedFullDate);
  }, [doctorId, selectedFullDate, fetchAvailability]);

  // Convert 08:00 => 08:00AM for UI
  const convertToDisplay = (time) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m}${ampm}`;
  };

  // Continue booking
  const handleContinueBooking = () => {
    if (!selectedTime) {
      console.error("Please select a time slot first.");
      return;
    }

    // The backend wants ISO time format HH:MM
    const selectedIsoTime = selectedTime; // e.g. "09:00"

    const typeForUrl = appointmentType.replace(" ", "-").toLowerCase();

    const destination = `/final-booking?type=${typeForUrl}&date=${selectedFullDate}&time=${selectedIsoTime}&doctorId=${doctorId}`;
    router.push(destination);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">

      <h2 className="text-xl font-bold mb-4 text-gray-800">Book an appointment</h2>

      {/* Appointment Type */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Choose the type of appointment</p>

        <div className="flex space-x-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600"
              name="appointmentType"
              checked={appointmentType === "In person"}
              onChange={() => { setAppointmentType("In person"); setSelectedTime(null); }}
            />
            <span className="ml-2 text-gray-700">In person</span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600"
              name="appointmentType"
              checked={appointmentType === "Video visit"}
              onChange={() => { setAppointmentType("Video visit"); setSelectedTime(null); }}
            />
            <span className="ml-2 text-gray-700">Video visit</span>
          </label>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Select an available date</p>

        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <button disabled className="p-2 text-gray-400"><FaChevronLeft className="w-4 h-4" /></button>

          <div className="flex space-x-2 overflow-x-auto">
            {upcomingDays.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer w-12 text-center ${
                  item.date === selectedDate
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <span className="text-xs font-semibold">{item.day}</span>
                <span className="text-sm font-bold">{item.date.split(" ")[1]}</span>
              </div>
            ))}
          </div>

          <button disabled className="p-2 text-gray-400"><FaChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Available Times for {selectedDate}</p>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Checking availability...</p>
          </div>
        ) : availableTimes.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
            No slots available on this date.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
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
        className={`w-full mt-6 py-3 font-semibold rounded-lg transition duration-150 shadow-md ${
          selectedTime
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
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
