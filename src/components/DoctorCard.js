import React from 'react';
import Link from 'next/link';
import { FaUserMd, FaVideo, FaClock, FaCheckCircle, FaStar } from 'react-icons/fa';

const DoctorCard = ({ doctor }) => {
    // Ensure robust default values
    const defaultDoctor = {
        name: "Dr. Specialist",
        degree: "N/A",
        in_person_cost: 0,
        video_cost: 0,
        wait_time: "N/A", // This should be a value like "Under 5 Min"
        experience_years: 0,
        satisfaction_rate: 0, // This should be a value like 100
        image_url: "/default-doctor-avatar.png",
    };

    const {
        name,
        degree,
        in_person_cost,
        video_cost,
        wait_time,
        experience_years,
        satisfaction_rate,
        image_url,
    } = { ...defaultDoctor, ...doctor };

    const videoConsultPath = `/video-consult/${doctor.id}`;
    const bookAppointmentPath = `/book-appointment/${doctor.id}`;

    const formatCost = (cost) => {
        // Assuming the cost is in NGN (Naira) from the image example
        return cost && cost > 0 ? `₦${cost.toLocaleString()}` : "Free";
    };

    // Helper component for the Metric Boxes (e.g., Wait Time, Experience)
    const MetricBox = ({ icon: Icon, value, label, valueClass = "text-gray-800", iconClass = "text-green-600" }) => (
        <div className="flex items-center space-x-2 py-4">
            <div className={`p-1.5 rounded-full ${iconClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
                <span className={`text-lg font-semibold ${valueClass}`}>{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
            </div>
        </div>
    );

    return (
        // The main container is now full width and responsive
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow duration-300 w-full">
            
            {/* Outer Flex Container: Holds doctor details and action buttons, side-by-side on large screens */}
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">

                {/* Left Section: Image, Details, Costs, and Metrics */}
                <div className="flex flex-grow space-x-4 sm:space-x-6 items-start">
                    
                    {/* Profile Image Section */}
                    <div className="flex-shrink-0 self-start">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                            {/* Image/Placeholder Logic (Keep existing logic) */}
                            {image_url && image_url !== "/default-doctor-avatar.png" ? (
                                <img
                                    src={image_url}
                                    alt={`Profile of ${name}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-gray-600">
                                    {name ? name.charAt(4) : 'D'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details and Metrics Column */}
                    <div className="flex flex-col w-full">
                        
                        {/* Name and Degree */}
                        <Link href={`/doctors/${doctor.id}`}>
                            <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">{name}</h2>
                        </Link>
                        <p className="text-sm text-gray-500 mb-4">{degree}</p>

                        {/* Costs (Aligned horizontally like the image) */}
                        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm mb-4">
                            <div className="flex items-center space-x-1.5">
                                <FaUserMd className="text-blue-600 flex-shrink-0" />
                                <span className="text-gray-600">In-person visits : </span>
                                <span className="text-blue-600 font-bold">{formatCost(in_person_cost)}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <FaVideo className="text-green-600 flex-shrink-0" />
                                <span className="text-gray-600">Video visits : </span>
                                <span className="text-green-600 font-bold">{formatCost(video_cost)}</span>
                            </div>
                        </div>

                        {/* Metrics Grid (Wait Time, Experience, Satisfaction) - Uses a 3-column grid for the side-by-side look */}
                        <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 mt-2 sm:mt-4">
                            
                            {/* Wait Time */}
                            <div className="flex flex-col items-center justify-center p-2">
                                <FaClock className="text-green-500 w-5 h-5 mb-1" />
                                <span className="text-sm font-bold text-gray-800">{wait_time}</span>
                                <span className="text-xs text-gray-500">Wait Time</span>
                            </div>

                            {/* Experience */}
                            <div className="flex flex-col items-center justify-center p-2">
                                <span className="text-lg font-bold text-gray-800">{experience_years} Years</span>
                                <span className="text-xs text-gray-500">Experience</span>
                            </div>

                            {/* Satisfaction */}
                            <div className="flex flex-col items-center justify-center p-2">
                                <FaCheckCircle className="text-green-500 w-5 h-5 mb-1" />
                                <span className="text-sm font-bold text-gray-800">{satisfaction_rate}%</span>
                                <span className="text-xs text-gray-500">Satisfied Patients</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Section: Action Buttons (Stacked vertically) */}
                <div className="flex flex-col space-y-3 w-full lg:w-48 lg:min-w-[192px] mt-4 lg:mt-0">
                    <Link
                        href={videoConsultPath}
                        className="text-center w-full px-4 py-2 text-sm font-semibold border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150 shadow-sm"
                    >
                        Video Consultation
                    </Link>
                    <Link
                        href={bookAppointmentPath}
                        className="text-center w-full px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;