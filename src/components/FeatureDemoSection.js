// src/components/FeatureDemoSection.js

"use client"; // Needs to be a Client Component for the video element

import React from 'react';
import Link from 'next/link';

// NOTE: This video path should be updated to your actual filename
const FEATURE_VIDEO_PATH = "/videos/scheduling-with-ai.mp4"; 

const FeatureDemoSection = () => {
  return (
    <section className="bg-blue-900 py-16 lg:py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-balance">
            Enhance Your Patient Scheduling Workflow
          </h2>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* --- LEFT COLUMN: Feature Text --- */}
          <div>
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Effortless Setup and Management
            </h3>
            <p className="text-lg text-blue-100 mb-6 text-pretty">
              Customize your services, define meeting types, and manage staff availability right from your dashboard. Our platform contextually sets up your booking environment so that the details align with your medical practice's unique needs.
            </p>
            
            <ul className="space-y-3 mb-8 text-blue-100">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 text-green-400">✅</div>
                <span>Sync staff calendars to prevent double-bookings.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 text-green-400">✅</div>
                <span>Create custom booking pages for different departments or specialists.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 text-green-400">✅</div>
                <span>Automate patient reminders and follow-ups.</span>
              </li>
            </ul>

            <Link href="/learn-more" passHref>
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-white text-blue-900 hover:bg-gray-200"
              >
                Learn More →
              </button>
            </Link>
          </div>

          {/* --- RIGHT COLUMN: The Video Demonstration --- */}
          <div className="relative w-full h-[350px] md:h-[450px] bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* The video element uses the downloaded file */}
            <video
              src={FEATURE_VIDEO_PATH}
              autoPlay
              loop
              muted
              playsInline 
              className="w-full h-full object-cover"
              poster="/placeholder-video-poster.jpg" // Add a poster image for faster loading
            >
              Your browser does not support the video tag.
            </video>
            
            {/* A subtle overlay to mimic the reference UI */}
            <div className="absolute inset-0 bg-black/10"></div> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureDemoSection;