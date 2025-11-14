// src/app/confirmation-success/page.js

"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar } from 'lucide-react';

export default function ConfirmationSuccessPage() {
    // NOTE: In a real application, you would use searchParams here 
    // to display the actual booking reference number, date, and time.
    
    // Static dummy data for the confirmation message
    const doctorName = "Dr. David Peter"; 
    const appointmentTime = "2:00 PM";
    const appointmentDate = "Nov 12, 2025";
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-2xl border border-green-200">
                
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you! Your appointment has been successfully scheduled.
                    </p>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                        Your Appointment Details
                    </h2>
                    
                    <DetailItem Icon={Calendar} label="Specialist" value={doctorName} />
                    <DetailItem Icon={Calendar} label="Date" value={appointmentDate} />
                    <DetailItem Icon={Clock} label="Time" value={appointmentTime} />
                    
                    <p className="text-sm text-gray-500 pt-4">
                        A confirmation email with all details, including location/video link, has been sent to your inbox. Please check your spam folder.
                    </p>
                </div>
                
                <div className="mt-8 flex flex-col space-y-3">
                    <Link href="/" passHref>
                        <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150">
                            Return to Homepage
                        </button>
                    </Link>
                    <Link href="/account" passHref>
                        <button className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150">
                            View My Appointments
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const DetailItem = ({ Icon, label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
        <div className="flex items-center text-gray-600">
            <Icon className="w-4 h-4 mr-2" />
            <span className="font-medium">{label}</span>
        </div>
        <span className="text-gray-900 font-semibold">{value}</span>
    </div>
);