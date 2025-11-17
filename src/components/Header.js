"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from 'react'; // <-- Import useState

export default function Header() {
  // State to manage the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section (Remains the same) */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-800" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-wide">
              MediCare Clinic
            </span>
          </Link>

          {/* Navbar Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Other Navigation Links (Remain the same) */}
            <Link
              href="/#home"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/UrgentCare"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
            >
              Urgent Care
            </Link>
            <Link
              href="/doctors"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
            >
              Doctors
            </Link>
            <Link
              href="#about"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
            >
              About Us
            </Link>

            {/* CTA Button (Remains the same) */}
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 shadow-lg"
            >
              <Link href="/register-doctor">Join Us</Link>
            </Button>

            {/* --- DROPDOWN LOGIN SECTION --- */}
            <div
              className="relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} >
              {/* Dropdown Toggle/Button */}
              <button
                className="text-white hover:text-blue-200 transition-colors text-sm font-medium border border-white rounded-full px-4 py-2 flex items-center"
              // Optional: For mobile/click behavior, you could add onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Login/Sign Up
              </button>

              {/* Dropdown Menu Content */}
              {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-64 rounded-sm shadow-2xl bg-white ring-1 ring-gray-200 focus:outline-none overflow-hidden transform origin-top-right transition-all duration-200">
                  <div className="py-3 px-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">Patient Access</p>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* PATIENT LOGIN */}
                    <Link
                      href="/login"
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      <svg className="w-5 h-5 mr-3 text-[#ff6900]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m0 0h14"></path></svg>
                      <span>Patient Login</span>
                    </Link>

                    {/* PATIENT SIGN UP */}
                    <Link
                      href="/register"
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    >
                      <svg className="w-5 h-5 mr-3 text-[#ff6900]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14c-1.357 0-2.5-0.743-3.3-1.884M16 14c1.357 0 2.5-0.743 3.3-1.884"></path></svg>
                      <span>New Patient Sign Up</span>
                    </Link>
                  </div>

                  {/* DOCTOR LOGIN SECTION */}
                  <div className="p-2 space-y-1 border-t border-gray-100">
                    <Link
                      href="/doctors/doctors-login"
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                    >
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-4 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"></path></svg>
                      <span>Doctor Login</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button (Remains the same) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-blue-700"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}