"use client";

import {
  Clock,
  Briefcase,
  DollarSign,
  Video,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorCard({ doctor, isLoggedIn }) {
  const router = useRouter();

  const {
    id,
    full_name,
    specialization,
    wait_time,
    experience_years,
    satisfaction_rate,
    in_person_fee,
    video_fee,
    city,
    image_url,
  } = doctor;

  const formatCurrency = (amount) => {
    if (
      amount === 0 ||
      amount === "0" ||
      amount === null ||
      amount === "Free"
    )
      return "Free";

    return `₦${Number(amount).toLocaleString()}`;
  };

  // ✅ NO AUTH REDIRECTS HERE — MIDDLEWARE HANDLES IT
  const handleAction = (e, targetPath) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login to continue.");
    }

    // Always navigate to the real protected route
    router.push(targetPath);
  };

  const patientImage = image_url || "/default-avatar.png";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col lg:flex-row justify-between items-stretch transition duration-200 hover:shadow-xl">
      
      {/* Left Section */}
      <div className="flex flex-col sm:flex-row gap-6 flex-grow">
        <div className="flex flex-col items-center sm:items-start flex-shrink-0">
          <img
            src={patientImage}
            alt={`Dr. ${full_name}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 mb-3"
          />
          <h3 className="text-xl font-bold text-blue-800 text-center sm:text-left">
            {full_name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {specialization || "General Practitioner"}
          </p>
        </div>

        <div className="sm:ml-8 flex flex-col justify-start space-y-2 text-sm text-gray-700 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium">{city || "Lagos, Nigeria"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium">In-person:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(in_person_fee)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:mt-0 lg:pl-6 lg:ml-6 flex-shrink-0">
        <MetricBox
          Icon={Clock}
          label="Wait Time"
          value={wait_time || "N/A"}
          unit=""
          color="text-green-500"
        />
        <MetricBox
          Icon={Briefcase}
          label="Experience"
          value={experience_years || 0}
          unit="Yrs"
          color="text-teal-500"
        />
        <MetricBox
          Icon={CheckCircle}
          label="Satisfaction"
          value={satisfaction_rate || 0}
          unit="%"
          color="text-green-600"
        />
      </div>

      {/* Right Section */}
      <div className="flex flex-col space-y-2 mt-6 lg:mt-0 lg:ml-8 flex-shrink-0 w-full sm:w-64">
        <button
          onClick={(e) => handleAction(e, `/video-consultation/${id}`)}
          className="py-3 px-4 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition duration-150 font-medium"
        >
          Video Consultation
        </button>

        <button
          onClick={(e) => handleAction(e, `/booking/${id}`)}
          className="py-3 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition duration-150 font-medium"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

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
