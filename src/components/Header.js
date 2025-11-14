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
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-70 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                  <div className="py-4">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                    >
                      Patient Login
                    </Link>
                    <Link
                      href="/doctors/doctors-login"
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                    >
                      Doctor Login
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