// src/app/final-booking/page.js

"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, User, Phone, Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

// --- DOCTOR LOOKUP (Using mock for display purposes) ---
const getDoctorData = (doctorId) => {
  const doctors = {
    '1': { name: "Dr. Jane Smith", service: "General Consultation (30 min)" },
    '2': { name: "Dr. David Peter", service: "Cardiology Review (45 min)" },
    '3': { name: "Dr. Emily Chen", service: "Pediatric Checkup (20 min)" },
    'default': { name: "Specialist", service: "Appointment (Unknown Service)" } 
  };
  return doctors[doctorId] || doctors['default'];
};
// --------------------------------------------------------

export default function FinalBookingPage() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  
  // Retrieve URL parameters, including the new 'time'
  const appointmentTypeRaw = searchParams.get('type');
  const selectedDateRaw = searchParams.get('date'); // Full date (YYYY-MM-DD)
  const selectedTimeRaw = searchParams.get('time'); // e.g., 2:00PM
  const doctorId = searchParams.get('doctorId') || '2'; 

  // Look up doctor details
  const doctorDetails = getDoctorData(doctorId);
  const doctorName = doctorDetails.name;
  const serviceName = doctorDetails.service;

  // State for form inputs
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format type and date for display
  const appointmentType = appointmentTypeRaw 
    ? appointmentTypeRaw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Not Specified';
  const selectedDateDisplay = selectedDateRaw || 'Today'; 
  const selectedTimeDisplay = selectedTimeRaw ? selectedTimeRaw.replace(/(\d+):(\d+)(AM|PM)/, '$1:$2 $3') : 'Not Specified';
  
  // Handler for form input changes
  const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Submission handler using the new API route
  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const bookingPayload = {
          ...formData,
          doctorId: doctorId,
          doctorName: doctorName,
          serviceName: serviceName,
          appointmentType: appointmentTypeRaw, 
          selectedDate: selectedDateRaw,
          selectedTime: selectedTimeRaw, // Use raw time for server processing
      };

      try {
          // Send data to the Next.js API Route Handler
          const response = await fetch('/api/bookings', { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(bookingPayload),
          });

          const result = await response.json();

          if (response.ok) {
              // Redirect to confirmation page, passing success details via query
              router.push(`/confirmation-success?ref=${result.referenceId}&dr=${result.doctorName}&date=${result.bookedDate}&time=${result.bookedTime}`);
          } else {
              // Handle server-side errors (400, 409, 500)
              if (response.status === 409) {
                   // Specific handling for conflict (as implemented in route.js)
                   // NOTE: Using alert() for simplicity, a custom modal is preferred
                   alert(`Booking Failed: ${result.message} Please go back and try another slot.`);
              } else {
                  alert(`Booking failed: ${result.message || 'Server error'}`);
              }
          }
      } catch (error) {
          console.error('Network or unexpected error:', error);
          alert('An unexpected error occurred. Please check your internet connection and try again.');
      } finally {
          setIsSubmitting(false);
      }
  };
  
  // --- COMPONENT START ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Confirm Your Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Finalizing your appointment with **{doctorName}**.
          </p>
        </div>

        {/* Booking Summary and Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 grid lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Summary */}
          <div className="space-y-6 border-r pr-6 border-gray-100">
            <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Appointment Details
            </h2>
            
            <div className="space-y-3">
              <SummaryItem label="Specialist" value={doctorName} />
              <SummaryItem label="Service" value={serviceName} />
              <SummaryItem label="Date Selected" value={selectedDateDisplay} Icon={Calendar} />
              <SummaryItem label="Time Selected" value={selectedTimeDisplay} Icon={Clock} /> {/* Displaying Time */}
              <SummaryItem label="Type" value={appointmentType} />
            </div>

            <p className="text-sm text-gray-500 pt-4">
              Need to change your time or date? Use the back button or navigate to the doctor's page.
            </p>
            
            <Link href={`/doctors?drId=${doctorId}`} passHref>
                <button 
                  className="mt-4 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    ← Change Selection
                </button>
            </Link>
          </div>

          {/* RIGHT COLUMN: Patient Information Form */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Contact Information
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <InputField id="name" type="text" placeholder="Full Name *" Icon={User} value={formData.name} onChange={handleInputChange} disabled={isSubmitting} />
              <InputField id="email" type="email" placeholder="Email Address *" Icon={Mail} value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
              <InputField id="phone" type="tel" placeholder="Phone Number *" Icon={Phone} value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />

              <div className="pt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Annual checkup, follow-up on allergy treatment, etc."
                  value={formData.notes} 
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={isSubmitting} className={`w-full py-3 font-semibold rounded-lg transition duration-150 shadow-md text-lg ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                  {isSubmitting ? 'Processing Booking...' : 'Confirm Final Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const SummaryItem = ({ label, value, Icon }) => (
  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 last:border-b-0">
    <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        <span className="text-gray-500 font-medium">{label}</span>
    </div>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

const InputField = ({ id, type, placeholder, Icon, value, onChange, disabled }) => (
  <div className="relative">
    <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
      required
      value={value} 
      onChange={onChange} 
      disabled={disabled}
    />
  </div>
);