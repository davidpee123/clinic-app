"use client";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-blue-600 text-lg">medicare Clinic</h1>
      </div>

      <div className="flex gap-6 text-gray-700 font-medium">
        <Link href="/">Home</Link>
        <Link href="/consultation">Consultation</Link>
        <Link href="/doctors">Doctors</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}
