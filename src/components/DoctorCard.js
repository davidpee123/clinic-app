import React from 'react';
// 💡 IMPORTANT: Replace 'next/navigation' with 'next/link'
import Link from 'next/link';
import { FaUserMd, FaVideo, FaClock, FaCheckCircle } from 'react-icons/fa';

const DoctorCard = ({ doctor }) => {
    const doctorId = doctor.id || 'placeholder-id';
    const defaultDoctor = {
        name: "Dr. Suneel suther Kumar",
        degree: "MBBS",
        in_person_cost: 15000,
        video_cost: 3000,
        wait_time: "Under 5 Min",
        experience_years: 4,
        satisfaction_rate: 100,
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

    // Define the target paths for the <Link> component
    const videoConsultPath = `/video-consult/${doctor.id}`;
    const bookAppointmentPath = `/book-appointment/${doctor.id}`;

    const formatCost = (cost) => {
        return cost ? `₦${cost.toLocaleString()}` : "N/A";
    };

    return (
        <div className="bg-blue-100 rounded-lg shadow-md p-4 md:p-6 border border-gray-100 flex flex-col sm:flex-row items-start space-x-4">
            {/* 1. Profile Image Section (No changes needed here) */}
            <div className="flex-shrink-0 mb-4 sm:mb-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                    {/* 💡 Corrected Logic: Only render the <img> if image_url has a value */}
                    {image_url && image_url !== "/default-doctor-avatar.png" ? (
                        <img
                            src={image_url}
                            alt={`Profile of ${name}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Render a placeholder if image_url is missing, empty, or default
                        <span className="text-3xl font-bold text-gray-600">
                            {name ? name.charAt(0) : 'D'}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. Details and Metrics Section (No changes needed here) */}
            <div className="flex-grow flex flex-col md:flex-row justify-between w-full">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{degree}</p>
                    <div className="flex flex-wrap items-center space-x-4 text-sm">
                        {/* In-person visits */}
                        <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-lg">
                            <FaUserMd className="text-blue-600" />
                            <span className="font-medium text-gray-700">In-person visits:</span>
                            <span className="text-blue-600 font-bold">{formatCost(in_person_cost)}</span>
                        </div>
                        {/* Video visits */}
                        <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-lg">
                            <FaVideo className="text-blue-600" />
                            <span className="font-medium text-gray-700">Video visits:</span>
                            <span className="text-blue-600 font-bold">{formatCost(video_cost)}</span>
                        </div>
                    </div>
                </div>
                {/* Metrics (Middle Section - separated by vertical lines) */}
                <div className="flex items-center justify-between text-center divide-x divide-gray-200">
                    <div className="flex flex-col items-center px-4">
                        <div className="flex items-center text-blue-600 text-lg font-bold">
                            <FaClock className="mr-1 text-sm" />
                            {wait_time}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Wait Time</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <div className="text-lg font-bold text-gray-800">
                            {experience_years} Years
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Experience</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <div className="flex items-center text-blue-600 text-lg font-bold">
                            <FaCheckCircle className="mr-1" />
                            {satisfaction_rate}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Satisfied Patients</p>
                    </div>
                </div>
            </div>

            {/* 3. Appointment Links Section */}
            <div className="flex flex-col space-y-2 mt-4 sm:mt-0 w-full sm:w-auto flex-shrink-0">
                <Link
                    href={videoConsultPath}
                    // The same button styling, but applied to the <Link> component
                    className="text-center px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150"
                >
                    Video Consultation
                </Link>
                <Link
                    href={bookAppointmentPath}
                    // The same button styling, but applied to the <Link> component
                    className="text-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                >
                    Book Appointment
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;