// src/app/patient-portal/reschedule/[appointmentId]/page.js

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from 'next/link';

export default function ReschedulePage({ params }) {
  const router = useRouter();
  const { appointmentId } = params;
  const [appointment, setAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Get ALL appointments from localStorage
    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    
    // 2. Log them to see what you're working with
    console.log("Appointments from localStorage:", storedAppointments);
    console.log("Appointment ID from URL:", appointmentId);

    // 3. Find the appointment that matches the ID from the URL
    // Use .find() to get a single object, not an array
    const foundAppointment = storedAppointments.find(
      (app) => app.id === appointmentId
    );

    // 4. Update the state with the found appointment
    if (foundAppointment) {
      setAppointment(foundAppointment);
    }
  }, [appointmentId]); // The dependency array ensures this runs when the ID changes

  const handleReschedule = async () => {
    if (!selectedDate) {
      alert("Please select a new date for your appointment.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call to update the appointment
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    alert(`Appointment with ${appointment.doctor} successfully rescheduled to ${selectedDate.toDateString()}!`);
    router.push('/patient-portal');
  };

  if (!appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading appointment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Button asChild variant="ghost" className="mb-6 self-start text-gray-600 hover:text-gray-900">
          <Link href="/patient-portal">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reschedule Your Appointment</CardTitle>
            <CardDescription className="text-gray-500">
              Select a new date for your appointment with **{appointment.doctor.name}** for **{appointment.reason}**.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                initialFocus
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleReschedule}
              disabled={!selectedDate || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm New Date"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}