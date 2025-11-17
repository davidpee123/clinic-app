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

  // Auto-Cycling Logic (Only active on the DESKTOP view)
  useEffect(() => {
    // Only run the auto-cycle if the screen size is large (or disable if not needed for mobile sequence)
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const next = prev === totalSteps ? 1 : prev + 1;
        return next;
      });
    }, 11500); 

    return () => clearInterval(interval);
  }, [totalSteps]); 

  // Helper component to render the video player
  const VideoPlayer = ({ videoSrc }) => (
    <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden mt-4 lg:mt-0">
      {/* Mock Browser Bar */}
      <div className="absolute top-0 left-0 w-full h-7 bg-gray-200 flex items-center px-3 z-10">
        <div className="flex space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-0 right-0 pt-7">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );

  return (
    <section className="py-10 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-2 text-base lg:text-lg text-gray-600">
            Booking appointments in 3 simple steps.
          </p>
        </div>

        {/* --- 1. MOBILE SEQUENTIAL LAYOUT (Visible below LG breakpoint) --- */}
        <div className="lg:hidden space-y-12">
          {stepsData.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Description */}
              <div className="p-0"> {/* Use StepItem content directly but styled for full width */}
                <div className="mb-4">
                  <span className="inline-flex items-center text-sm font-semibold bg-yellow-400 text-gray-900 px-3 py-1 rounded-full">
                    {step.number.split(' ')[1]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-lg text-gray-600">{step.description}</p>
              </div>

              {/* Sequential Video Player */}
              <VideoPlayer videoSrc={step.video} />
            </div>
          ))}
        </div>


        {/* --- 2. DESKTOP INTERACTIVE LAYOUT (Visible only on LG breakpoint and above) --- */}
        <div className="hidden lg:grid grid-cols-2 gap-24 items-start">
          
          {/* LEFT COLUMN (The Steps - Interactive) */}
          <div className="flex flex-col space-y-6 order-2 lg:order-1">
            {stepsData.map((step) => (
              <StepItem
                key={step.id}
                number={step.number}
                title={step.title}
                description={step.description}
                isActive={activeStep === step.id}
                onClick={() => setActiveStep(step.id)}
              />
            ))}
          </div>

          {/* RIGHT COLUMN (The Dynamic Video) */}
          <div className="relative w-full h-[450px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden order-1 lg:order-2">
            
            {/* Mock Browser Bar */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gray-200 flex items-center px-3 z-10">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* This div contains all the videos (opacity controlled) */}
            <div className="absolute top-0 bottom-0 left-0 right-0 pt-8">
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
// 3. A HELPER COMPONENT FOR EACH STEP (Used only for Desktop Interactive View)
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
      <div className="flex items-start space-x-4">
        {/* Number Badge */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
            isActive
              ? "bg-orange-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {number.split(' ')[1]}
        </div>
        {/* Text Content */}
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;