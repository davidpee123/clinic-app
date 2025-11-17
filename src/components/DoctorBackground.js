// src/components/DoctorBackground.js

import React from 'react';

const DoctorBackground = ({ doctor }) => {
  const {
    name,
    specialty,
    practiceName,
    hospitalAffiliations,
    experienceYears,
    degree,
    languages, // This is expected to be an array of strings
    npi, // NPI number from the image
  } = doctor;

  // Helper component for displaying a single label/value pair
  const DetailItem = ({ label, value }) => (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
      <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
      {/* Ensured value text can wrap easily */}
      <p className="text-base font-medium text-gray-800 break-words">{value}</p>
    </div>
  );

  return (
    <>
      {/* Reduced padding slightly for better mobile fit */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-100 space-y-8">

        {/* Education and Background Title */}
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Education and background
        </h2>

        {/* Grid for Specialties, Practice, Hospital, and Experience */}
        {/* 🚨 FIX: Changed grid-cols-2 md:grid-cols-4 to grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 */}
        {/* This ensures a single column on the smallest mobile screens, two on tablets/mid-screens, and four on large desktops. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <DetailItem label="Specialties" value={specialty || 'N/A'} />
          <DetailItem label="Practice names" value={practiceName || 'N/A'} />
          <DetailItem label="Hospital affiliations" value={hospitalAffiliations || 'N/A'} />
          <DetailItem label="Experience" value={experienceYears ? `${experienceYears} Years` : 'N/A'} />
        </div>

        {/* Languages, Degree, and NPI Section */}
        <div className="pt-4 border-t border-gray-100 space-y-6">

          {/* Languages Spoken */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Languages spoken</h3>
            {/* Use flex-wrap for horizontal scrolling languages if there are many */}
            <div className="flex flex-wrap gap-2">
              {languages && languages.length > 0 ? (
                languages.map((lang, index) => (
                  <span key={index} className="text-gray-600 px-3 py-1 bg-blue-50 rounded-full text-sm font-medium border border-blue-200">
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 p-2">No languages listed.</p>
              )}
            </div>
          </div>

          {/* Education and NPI */}
          {/* 🚨 FIX: Changed grid-cols-1 md:grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
          {/* This ensures the two fields go side-by-side as soon as possible on larger phones/tablets. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
            {/* Education/Degree */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Education and training</h3>
              <p className="text-base text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {degree || 'Degree Not Specified'}
              </p>
            </div>

            {/* NPI Number */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">NPI number</h3>
              <p className="text-base text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {npi || 'N/A'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default DoctorBackground;