// src/components/BookingWidget.js (CLEANED UP CODE)

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Function to generate the next 7 days dynamically
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
      date: `${months[date.getMonth()]} ${date.getDate()}`, // e.g., Nov 8
      fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD
    });
  }
  return upcoming;
};

const BookingWidget = ({ doctor }) => {
  const router = useRouter(); 
  const upcomingDays = getUpcomingDays();
  const doctorId = doctor?.id || '2'; 

  const [appointmentType, setAppointmentType] = useState('In person'); 
  // Initialize selectedDate with the first day's formatted date
  const [selectedDate, setSelectedDate] = useState(upcomingDays[0].date); 
  const [selectedTime, setSelectedTime] = useState(null); 
  
  // NEW STATES for dynamic data fetching
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find the full date string (YYYY-MM-DD) for passing to the next page
  const selectedFullDate = upcomingDays.find(d => d.date === selectedDate)?.fullDate || upcomingDays[0].fullDate;

  // Function to fetch availability from the backend
  const fetchAvailability = useCallback(async (drId, fullDate) => {
    if (!drId || !fullDate) return;

    setIsLoading(true);
    setAvailableTimes([]);
    setSelectedTime(null); // Clear selected time on date/doctor change

    try {
      // Fetch availability from the simulated API route
      const response = await fetch(`/api/bookings?doctorId=${drId}&date=${fullDate}`);
      const result = await response.json();

      if (response.ok) {
        setAvailableTimes(result.availableTimes || []);
      } else {
        console.error("Failed to fetch availability:", result.message);
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error("Network error during availability fetch:", error);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to run the fetch when doctor or date changes
  useEffect(() => {
    fetchAvailability(doctorId, selectedFullDate);
  }, [doctorId, selectedFullDate, fetchAvailability]);
  
  // Handler for the final booking step
  const handleContinueBooking = () => {
    if (!selectedTime) {
      console.error("Please select a time slot to continue."); 
      return;
    }
    
    // Pass the cleaned time slot (e.g., "9:00AM") for the API
    const timeForUrl = selectedTime.replace(' ', ''); 
    const typeForUrl = appointmentType.replace(' ', '-').toLowerCase();

    const destination = `/final-booking?type=${typeForUrl}&date=${selectedFullDate}&time=${timeForUrl}&doctorId=${doctorId}`;
    
    router.push(destination);
  };

  // Helper to handle date selection cleanly
  const handleDateSelect = (dateItem) => {
    setSelectedDate(dateItem.date);
    // The useEffect hook will automatically call fetchAvailability due to selectedFullDate change.
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Book an appointment</h2>
      
      {/* 1. Appointment Type Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Choose the type of appointment</p>
        <div className="flex space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" 
                name="appointmentType" 
                value="In person" 
                checked={appointmentType === 'In person'} 
                onChange={() => {setAppointmentType('In person'); setSelectedTime(null);}}
              />
              <span className="ml-2 text-gray-700">In person</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" 
                name="appointmentType" 
                value="Video visit" 
                checked={appointmentType === 'Video visit'} 
                onChange={() => {setAppointmentType('Video visit'); setSelectedTime(null);}}
              />
              <span className="ml-2 text-gray-700">Video visit</span>
            </label>
        </div>
      </div>

      {/* 2. Calendar Availability (Date Selector) */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Select an available date</p>
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          {/* Calendar arrows (functionality not implemented, but kept for UX consistency) */}
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" disabled>
            <FaChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-2 overflow-x-auto">
            {upcomingDays.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleDateSelect(item)} 
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition flex-shrink-0 w-12 text-center ${
                  item.date === selectedDate 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-semibold">{item.day}</span>
                <span className="text-sm font-bold">{item.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" disabled>
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 3. Time Slots (Now dynamically fetched) */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 mb-2">
            Available Times for {selectedDate}
        </p>
        
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
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
        )}
      </div>
      
      {/* 4. Final Book Button */}
      <button 
        className={`w-full mt-6 py-3 font-semibold rounded-lg transition duration-150 shadow-md ${
            selectedTime
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
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