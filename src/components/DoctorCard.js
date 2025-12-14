// components/DoctorCard.js

import { Clock, Briefcase, DollarSign, Video, CheckCircle, MapPin } from 'lucide-react';

export default function DoctorCard({ doctor }) {
    // Ensure all these properties are being selected in the main fetch query
    const {
        id,
        full_name,
        specialization,
        wait_time, // e.g., "Under 5"
        experience_years, // e.g., 10
        satisfaction_rate, // e.g., 100
        in_person_fee, // e.g., 15000
        video_fee, // e.g., 3000
        city, // e.g., Lagos
    } = doctor;

    // Helper for formatting currency (assuming Nigerian Naira '₦' based on image)
    const formatCurrency = (amount) => {
        if (amount === 0 || amount === '0' || amount === null || amount === 'Free') return 'Free';
        // Adjust based on your actual currency handling
        return `₦${Number(amount).toLocaleString()}`;
    };

    const patientImage = doctor.image_url || '/default-avatar.png';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col lg:flex-row justify-between items-stretch transition duration-200 hover:shadow-xl">
            
            {/* Left Section: Info and Fees */}
            <div className="flex flex-col sm:flex-row gap-6 flex-grow">
                {/* Avatar and Primary Info */}
                <div className="flex flex-col items-center sm:items-start flex-shrink-0">
                    <img
                        src={patientImage}
                        alt={`Dr. ${full_name}`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 mb-3"
                    />
                    <h3 className="text-xl font-bold text-blue-800 text-center sm:text-left">{full_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{specialization || 'General Practitioner'}</p>
                </div>
                
                {/* Fees and Location Details */}
                <div className="sm:ml-8 flex flex-col justify-start space-y-2 text-sm text-gray-700 w-full sm:w-auto mt-4 sm:mt-0">
                    
                    {/* Location */}
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{city || 'Lagos, Nigeria'}</span>
                    </div>

                    {/* In-person Fee */}
                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium">In-person visits:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(in_person_fee)}</span>
                    </div>

                    {/* Video Fee */}
                    <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">Video visits:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(video_fee)}</span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Metrics (Grid Layout) */}
            {/* Separator for medium screens and up */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:mt-0 lg:pl-6 lg:ml-6 flex-shrink-0">
                {/* Wait Time */}
                <MetricBox Icon={Clock} label="Wait Time" value={wait_time || "N/A"} unit={wait_time && wait_time !== "N/A" ? "Min" : ""} color="text-green-500" />
                
                {/* Experience */}
                <MetricBox Icon={Briefcase} label="Experience" value={experience_years || 0} unit="Years" color="text-teal-500" />
                
                {/* Satisfaction */}
                <MetricBox Icon={CheckCircle} label="Satisfaction" value={satisfaction_rate || 0} unit="%" color="text-green-600" />
            </div>

            {/* Right Section: Actions */}
            <div className="flex flex-col space-y-2 mt-6 lg:mt-0 lg:ml-8 flex-shrink-0 w-full sm:w-64">
                <button
                    className="py-3 px-4 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition duration-150 font-medium"
                    onClick={() => console.log(`Navigating to video consult details for ${full_name}`)}
                >
                    Video Consultation
                </button>
                <a 
                    href={`/booking/${id}`} // Navigates to the booking page for this doctor
                    className="py-3 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition duration-150 font-medium text-center"
                >
                    Book Appointment
                </a>
            </div>
        </div>
    );
}

// Helper Component for Metrics
const MetricBox = ({ Icon, label, value, unit, color }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <Icon className={`h-6 w-6 ${color} mb-1`} />
        <span className="text-xl font-bold text-gray-900 leading-none">
            {value}
        </span>
        <span className="text-sm font-medium text-gray-500 leading-tight">
            {unit}
        </span>
        <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
);