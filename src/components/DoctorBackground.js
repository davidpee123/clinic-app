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
      <p className="text-base font-medium text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-8">
      
      {/* Education and Background Title */}
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
        Education and background
      </h2>

      {/* Grid for Specialties, Practice, Hospital, and Experience */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <DetailItem label="Specialties" value={specialty || 'N/A'} />
        <DetailItem label="Practice names" value={practiceName || 'N/A'} />
        <DetailItem label="Hospital affiliations" value={hospitalAffiliations || 'N/A'} />
        <DetailItem label="Experience" value={experienceYears || 'N/A'} />
      </div>

      {/* Languages, Degree, and NPI Section */}
      <div className="pt-4 border-t border-gray-100 space-y-6">
        
        {/* Languages Spoken */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Languages spoken</h3>
          <ul className="space-y-2">
            {languages && languages.length > 0 ? (
              languages.map((lang, index) => (
                <li key={index} className="text-gray-600 p-2 bg-gray-50 rounded-md border border-gray-200">
                  {lang}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No languages listed.</li>
            )}
          </ul>
        </div>
        
        {/* Education and NPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education/Degree */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Education and training</h3>
                <p className="text-base text-gray-600 p-2 bg-gray-50 rounded-md border border-gray-200">
                    {degree || 'Degree Not Specified'}
                </p>
            </div>
            
            {/* NPI Number */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">NPI number</h3>
                <p className="text-base text-gray-600 p-2 bg-gray-50 rounded-md border border-gray-200">
                    {npi || 'N/A'}
                </p>
            </div>
        </div>

      </div>
      
    </div>
  );
};

export default DoctorBackground;