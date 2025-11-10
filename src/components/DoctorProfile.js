// /components/DoctorProfile.js

import React from 'react';
import DoctorHeader from './DoctorHeader';
import DoctorBackground from './DoctorBackground';
import DoctorDetails from './DoctorDetails';
import DoctorReviews from './DoctorReviews';
import BookingWidget from './BookingWidget';

// 💡 This component assumes the 'doctor' object is passed to it from the parent page.
export default function DoctorProfile({ doctor }) {
  // Use a quick check to prevent errors if doctor data isn't loaded yet
  if (!doctor) {
      return <div className="text-center py-10 text-lg">Loading doctor profile...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:w-2/3 space-y-8">
          
          <DoctorHeader doctor={doctor} />
          <DoctorBackground doctor={doctor} />
          <DoctorDetails doctor={doctor} />
          <DoctorReviews doctor={doctor} />
          
        </div>

        {/* RIGHT COLUMN: Booking Sidebar */}
        <aside className="lg:w-1/3 sticky top-4">
          <BookingWidget doctor={doctor} />
        </aside>

      </div>
    </div>
  );
}