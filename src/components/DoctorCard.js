// src/components/DoctorCard.js

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
        wait_time: "N/A",
        experience_years: 0,
        satisfaction_rate: 0,
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
        return cost && cost > 0 ? `₦${cost.toLocaleString()}` : "Free";
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 border border-gray-100 transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                
                {/* 1. Profile Image Section */}
                <div className="flex-shrink-0 mb-2 sm:mb-0 self-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-blue-50">
                        {/* Image/Placeholder Logic */}
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

                {/* 2. Details, Costs, and Metrics Section (Split into left and right content) */}
                <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                    
                    {/* LEFT: Name and Costs (Stacked on ALL screens) */}
                    <div className="mb-4 sm:mb-0 sm:pr-6">
                        <Link href={`/doctors/${doctor.id}`}>
                            <h2 className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors cursor-pointer">{name}</h2>
                        </Link>
                        <p className="text-base text-gray-500 mb-4">{degree}</p>

                        {/* Cost Details (Now always wrapped to new lines on mobile) */}
                        <div className="flex flex-col space-y-2 text-sm mt-3">
                            <div className="flex items-center space-x-2">
                                <FaUserMd className="text-blue-600 flex-shrink-0" />
                                <span className="font-medium text-gray-700">In-person:</span>
                                <span className="text-blue-600 font-bold">{formatCost(in_person_cost)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaVideo className="text-green-600 flex-shrink-0" />
                                <span className="font-medium text-gray-700">Video Visit:</span>
                                <span className="text-green-600 font-bold">{formatCost(video_cost)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* RIGHT: Metrics & Actions (The most complex part) */}
                    <div className="flex flex-col justify-between w-full sm:w-auto">
                        
                        {/* Metrics: Changed from horizontal division to a vertical/wrapped stack for better mobile layout */}
                        <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 border-t pt-4 sm:border-none sm:pt-0 mb-4 sm:mb-6">
                            
                            {/* Wait Time */}
                            <div className="flex flex-col items-center sm:items-start p-1 sm:p-0">
                                <div className="flex items-center text-blue-600 text-base font-bold">
                                    <FaClock className="mr-1 text-sm" />
                                    {wait_time}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Wait Time</p>
                            </div>
                            
                            {/* Experience */}
                            <div className="flex flex-col items-center sm:items-start p-1 sm:p-0">
                                <div className="text-base font-bold text-gray-800">
                                    {experience_years}+ Years
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Experience</p>
                            </div>
                            
                            {/* Satisfaction */}
                            <div className="flex flex-col items-center sm:items-start p-1 sm:p-0">
                                <div className="flex items-center text-orange-500 text-base font-bold">
                                    <FaStar className="mr-1 w-3 h-3" />
                                    {satisfaction_rate}%
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Satisfied</p>
                            </div>
                        </div>

                        {/* 3. Appointment Links Section (Full width on mobile, stacked) */}
                        <div className="flex flex-col space-y-3 w-full sm:w-56 mt-2">
                            <Link
                                href={videoConsultPath}
                                className="text-center w-full px-4 py-2.5 text-sm font-semibold border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-150 shadow-sm"
                            >
                                Video Consultation
                            </Link>
                            <Link
                                href={bookAppointmentPath}
                                className="text-center w-full px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;