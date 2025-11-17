// src/components/DoctorReviews.js
"use client";

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

// Sample reviews data (for demonstration purposes)
const sampleReviews = [
  {
    text: "Knowledgable and got diagnosed and treated on the spot. Consultation was quick and easy.",
    date: "02/02/2024",
    type: "Video Visit",
    reviewer: "Flory Emakpose"
  },
  {
    text: "Fantastic experience! The doctor was very attentive and resolved my issue quickly. Highly recommend.",
    date: "05/02/2024",
    type: "In-person Visit",
    reviewer: "Chinedu Okafor"
  },
  {
    text: "A true professional. Best virtual consultation I've had. Waiting time was minimal.",
    date: "15/02/2024",
    type: "Video Visit",
    reviewer: "Aisha Bello"
  },
];

const DoctorReviews = ({ doctor }) => {
  const { rating = 5.0 } = doctor; // Default to 5.0 if not provided for visual consistency
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      (prevIndex + 1) % sampleReviews.length
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      (prevIndex - 1 + sampleReviews.length) % sampleReviews.length
    );
  };

  const currentReview = sampleReviews[currentReviewIndex];
  const maxStars = 5;

  // Reduced padding slightly for better mobile fit
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
        Patient reviews ({sampleReviews.length})
      </h2>

  {/* Rating and Review Carousel Container */ }
  <div className="flex flex-col md:flex-row md:space-x-8">

    {/* Left Side: Overall Rating */}
    {/* 🚨 FIX: Changed items-start to items-center on mobile, items-start on desktop */}
    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start pb-4 md:pb-0 mb-4 md:mb-0 border-b md:border-b-0 md:border-r border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Overall rating</h3>

      {/* Rating Score */}
      <div className="text-5xl font-extrabold text-blue-600 mb-1">
        {rating ? rating.toFixed(1) : '5.0'} {/* Displaying one decimal place */}
      </div>

      {/* Star Icons */}
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: maxStars }).map((_, index) => (
          <FaStar
            key={index}
            className={index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
    </div>

    {/* Right Side: Recent Review Carousel */}
    <div className="w-full md:w-2/3">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent reviews</h3>

      <div className="relative p-5 border border-gray-300 rounded-xl bg-blue-50">
        {/* Carousel Content */}
        <div className="min-h-[90px] flex flex-col justify-between">
          <p className="italic text-gray-700 mb-3 leading-relaxed text-base">
            "{currentReview.text}"
          </p>
          <div className="text-xs text-gray-500 font-medium pt-2 border-t border-gray-200 flex justify-between items-center">
            <span>{currentReview.reviewer} | {currentReview.date}</span>
            <span className="text-blue-500">{currentReview.type}</span>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        {sampleReviews.length > 1 && (
          <>
            {/* 🚨 FIX: Used absolute -5 or -6 for positioning outside the box, but inside the main container padding */}
            <button
              onClick={prevReview}
              className="absolute left-[-15px] sm:left-[-20px] top-1/2 transform -translate-y-1/2 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              disabled={currentReviewIndex === 0}
              aria-label="Previous review"
            >
              <FaChevronLeft className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-[-15px] sm:right-[-20px] top-1/2 transform -translate-y-1/2 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              disabled={currentReviewIndex === sampleReviews.length - 1}
              aria-label="Next review"
            >
              <FaChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </>
        )}
      </div>
    </div>

  </div>

  {/* "See All Reviews" Button */ }
  <button className="mt-6 text-blue-600 font-medium hover:text-blue-800 transition duration-150">
    See All {sampleReviews.length} Reviews
  </button>

    </div >
  );
};

export default DoctorReviews;