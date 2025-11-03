"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function CheckInPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle check-in
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!patientName || !doctorName) {
      setMessage("Please enter both patient and doctor names.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientName, doctorName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Success! You have been added to the queue.");
        setTimeout(() => {
          router.push("/queue-status");
        }, 2000);
      } else {
        setMessage(`Error: ${data.message || "Failed to check in."}`);
      }
    } catch (error) {
      setMessage("Error: A network error occurred.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                MediCare Clinic
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#home" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/#services" className="text-gray-700 hover:text-blue-600">Services</Link>
              <Link href="/#doctors" className="text-gray-700 hover:text-blue-600">Doctors</Link>
              <Link href="/#about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link href="/#contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Check-In Card */}
      <div className="flex justify-center items-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Heart className="h-10 w-10 text-blue-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Check In
            </CardTitle>
            <CardDescription>
              Enter your details to join the appointment queue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCheckIn} className="space-y-5">
              {/* Patient Name */}
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              {/* Doctor Name */}
              <div>
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Smith"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                disabled={loading}
              >
                {loading ? "Checking In..." : "Check In"}
              </Button>

              {/* Message */}
              {message && (
                <div
                  className={`p-3 text-sm rounded-md text-center ${message.startsWith("Error")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                    }`}
                >
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
