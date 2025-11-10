// src/components/HowItWorksSection.js

"use client";

import React, { useState, useEffect } from 'react';

const stepsData = [
  {
    id: 1,
    number: "STEP 01",
    title: "Customize availability",
    description: "Add your available times and sync your calendars in one place.",
    video: "/videos/zbs-personalize-availability.mp4",
  },
  {
    id: 2,
    number: "STEP 02",
    title: "Share your booking link",
    description: "Let clients see your availability from a custom booking page.",
    video: "/videos/zbs-share-your-booking.mp4",
  },
  {
    id: 3,
    number: "STEP 03",
    title: "Get booked",
    description: "Have clients schedule appointments for their preferred time slots.",
    video: "/videos/zbs-get-booked.mp4",
  },
];

// ---
// 2. CREATE THE COMPONENT
// ---
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = stepsData.length;
  
  // --- ADDED LOGIC: Auto-Cycling ---
  useEffect(() => {
    // Set up a timer to change the step every 5000 milliseconds (5 seconds)
    const interval = setInterval(() => {
      setActiveStep(prev => {
        // Calculate the next step: (1, 2, 3, 1, 2, 3, ...)
        const next = prev === totalSteps ? 1 : prev + 1;
        return next;
      });
    }, 11500); // Adjust this timing based on the length of your shortest video

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [totalSteps]); 
  // ---------------------------------

  return (
    <section className="py-10 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Booking appointments in 3 simple steps.
          </p>
        </div>

        {/* Main Split-Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* --- LEFT COLUMN (The Steps) --- */}
          <div className="flex flex-col space-y-6">
            {stepsData.map((step) => (
              <StepItem
                key={step.id}
                number={step.number}
                title={step.title}
                description={step.description}
                isActive={activeStep === step.id}
                // We keep the onClick handler so users can still manually navigate!
                onClick={() => setActiveStep(step.id)}
              />
            ))}
          </div>

          {/* --- RIGHT COLUMN (The Videos) --- */}
          <div className="relative w-full h-80 lg:h-[450px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            {/* Mock Browser Bar */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gray-200 flex items-center px-3 z-10">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* This div contains all the videos */}
            <div className="absolute top-0 bottom-0 left-0 right-0">
              {stepsData.map((step) => (
                <video
                  key={step.id}
                  src={step.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    activeStep === step.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---
// 3. A HELPER COMPONENT FOR EACH STEP
// ---
const StepItem = ({ number, title, description, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
        isActive
          ? "bg-white shadow-lg scale-105"
          : "bg-transparent opacity-60 hover:opacity-100"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
            isActive
              ? "bg-orange-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {number.split(' ')[1]}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;