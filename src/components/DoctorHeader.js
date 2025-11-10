import React from 'react';
import { FaUserMd, FaVideo, FaCheckCircle, FaStar, FaClock } from 'react-icons/fa';

// Component for the top section of the doctor's profile page
const DoctorHeader = ({ doctor }) => {
  const { 
    name, 
    specialty, 
    practiceName, 
    image_url, 
    inPersonCost, 
    videoCost, 
    rating, 
    waitStats 
  } = doctor;

  // Function to format the currency
  const formatCost = (cost) => {
    return cost ? `₦${cost.toLocaleString()}` : "N/A";
  };
  
  // Example data for rating and wait time based on the image
  const percentage5Star = "100%";
  const excellentWaitTime = "Excellent wait time";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      
      {/* Top Row: Image, Name, Practice, and Costs */}
      <div className="flex items-start space-x-6 mb-6 pb-4 border-b border-gray-100">
        
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-lg">
            {image_url ? (
              <img
                src={image_url}
                alt={`Profile of ${name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-600 flex h-full items-center justify-center">
                {name ? name.charAt(0) : 'D'}
              </span>
            )}
          </div>
        </div>
        
        {/* Doctor Info */}
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-lg text-gray-600 mb-4">{specialty || 'Primary Care'}, {practiceName || 'Practice Name'}</p>
          
          {/* Cost Tags */}
          <div className="flex space-x-4 text-md">
            <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-2 rounded-md">
              <FaUserMd className="text-blue-600" />
              <span>In-person visits:</span>
              <span className="font-bold text-blue-600">{formatCost(inPersonCost)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-2 rounded-md">
              <FaVideo className="text-blue-600" />
              <span>Video visits:</span>
              <span className="font-bold text-blue-600">{formatCost(videoCost)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row: Ratings and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Highly Recommended */}
        <div className="flex items-start space-x-3">
          <FaCheckCircle className="text-green-600 text-2xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-800">Highly recommended</h3>
            <p className="text-sm text-gray-600">{percentage5Star} of patients gave this doctor 5 stars</p>
          </div>
        </div>
        
        {/* Excellent Wait Time */}
        <div className="flex items-start space-x-3">
          <FaClock className="text-green-600 text-2xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-800">{excellentWaitTime}</h3>
            <p className="text-sm text-gray-600">{waitStats}</p>
          </div>
        </div>
        
        {/* New Patient Appointments */}
        <div className="flex items-start space-x-3">
          <FaStar className="text-yellow-500 text-2xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-800">New patient appointments</h3>
            <p className="text-sm text-gray-600">Appointments available for new patients on Babatelehealth</p>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default DoctorHeader;