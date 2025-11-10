"use client";
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BookingWidget = ({ doctor }) => {
  // State to manage the selected appointment type (In Person or Video Visit)
  const [appointmentType, setAppointmentType] = useState('In person'); 
  
  // Dummy data for the next few days based on the image
  const upcomingDays = [
    { day: 'Sat', date: 'Nov 8' },
    { day: 'Sun', date: 'Nov 9' },
    { day: 'Mon', date: 'Nov 10' },
    { day: 'Tue', date: 'Nov 11' },
    { day: 'Wed', date: 'Nov 12' },
    { day: 'Thu', date: 'Nov 13' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Book an appointment</h2>
      
      {/* 1. Appointment Type Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Choose the type of appointment</p>
        <div className="flex space-x-4">
          
          {/* In Person Radio Button */}
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" 
              name="appointmentType" 
              value="In person"
              checked={appointmentType === 'In person'}
              onChange={() => setAppointmentType('In person')}
            />
            <span className="ml-2 text-gray-700">In person</span>
          </label>
          
          {/* Video Visit Radio Button */}
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="radio" 
              className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" 
              name="appointmentType" 
              value="Video visit"
              checked={appointmentType === 'Video visit'}
              onChange={() => setAppointmentType('Video visit')}
            />
            <span className="ml-2 text-gray-700">Video visit</span>
          </label>
        </div>
      </div>

      {/* 2. Calendar Availability */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Select an available time</p>
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          {/* Calendar Navigation Arrows */}
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <FaChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Day/Date Tiles */}
          <div className="flex space-x-2">
            {upcomingDays.map((item, index) => (
              <div 
                key={index}
                // Highlight the first day as selected, similar to the image
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition ${
                  index === 0 // Change this logic to reflect actual selection state
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-semibold">{item.day}</span>
                <span className="text-sm font-bold">{item.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 3. Time Slots (Placeholder) */}
      <div className="mt-4">
        <p className="text-sm text-gray-500 italic">
          Time slots for **{appointmentType}** will appear here upon selection.
        </p>
        {/* You would integrate time slot components here */}
      </div>

      {/* 4. Final Book Button (Can be added here once time is selected) */}
      <button 
        className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
        // onClick handler would trigger the final booking submission
      >
        Continue Booking
      </button>
      
    </div>
  );
};

export default BookingWidget;