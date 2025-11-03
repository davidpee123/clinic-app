"use client"

import { useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Heart, ArrowLeft, CalendarIcon, Clock, CheckCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const doctors = [
    {
        id: "1",
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        department: "Cardiology",
        image: "/female-doctor.png",
        experience: "15 years",
        rating: 4.9,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
        timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    },
    {
        id: "2",
        name: "Dr. Michael Chen",
        specialty: "General Physician",
        department: "General Medicine",
        image: "/male-doctor.png",
        experience: "12 years",
        rating: 4.8,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
    },
    {
        id: "3",
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrician",
        department: "Pediatrics",
        image: "/female-pediatrician.png",
        experience: "10 years",
        rating: 4.9,
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
    },
    {
        id: "4",
        name: "Dr. James Wilson",
        specialty: "Emergency Medicine",
        department: "Emergency Care",
        image: "/male-emergency-doctor.jpg",
        experience: "18 years",
        rating: 4.7,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        timeSlots: ["08:00", "12:00", "16:00", "20:00"],
    },
]

const departments = [
    "Cardiology",
    "General Medicine",
    "Pediatrics",
    "Emergency Care",
    "Orthopedics",
    "Dermatology",
    "Neurology",
    "Psychiatry",
]

// ... (all imports and definitions of doctors, departments, etc. remain the same)

export default function BookAppointmentPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [step, setStep] = useState(1)
    const [selectedDepartment, setSelectedDepartment] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectedDate, setSelectedDate] = useState()
    const [selectedTime, setSelectedTime] = useState("")
    const [patientInfo, setPatientInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        reason: "",
        isExistingPatient: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingComplete, setBookingComplete] = useState(false)
    const [appointmentId, setAppointmentId] = useState("")

    const filteredDoctors = selectedDepartment
        ? doctors.filter((doctor) => doctor.department === selectedDepartment)
        : doctors

    const generateTimeSlots = (doctor, date) => {
        if (!doctor || !date) return []

        const dayName = format(date, "EEEE")
        if (!doctor.availableDays.includes(dayName)) return []

        return doctor.timeSlots.map((time) => ({
            time,
            available: Math.random() > 0.3, // Simulate some slots being unavailable
        }))
    }

    const timeSlots = selectedDoctor && selectedDate ? generateTimeSlots(selectedDoctor, selectedDate) : []

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const patientFullName = `${patientInfo.firstName} ${patientInfo.lastName}`;

        const appointmentTime = selectedDate && selectedTime
            ? new Date(
                `${selectedDate.toISOString().split("T")[0]}T${selectedTime}`
            ).toISOString()
            : null;

        console.log("Submitting appointment with data:", {
            patientName: patientFullName,
            doctorName: selectedDoctor?.name,
            appointmentTime,
        });

        try {
            const response = await fetch("/api/book-appointment", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientName: patientFullName,
                    doctorName: selectedDoctor?.name,
                    appointmentTime,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setAppointmentId(result.data?.[0]?.id);
                setBookingComplete(true);
            } else {
                console.error("Booking failed:", result.message);
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (bookingComplete) {
        // ... (Confirmation page JSX remains the same)
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">MediCare Clinic</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h1>
                            <p className="text-gray-600 mb-8">
                                Your appointment has been successfully booked. You will receive a confirmation email shortly.
                            </p>

                            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                                <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Appointment ID:</span>
                                        <span className="font-medium">{appointmentId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Doctor:</span>
                                        <span className="font-medium">{selectedDoctor?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Department:</span>
                                        <span className="font-medium">{selectedDoctor?.department}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium">{selectedDate && format(selectedDate, "PPP")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time:</span>
                                        <span className="font-medium">{selectedTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="flex-1" asChild>
                                    <Link href="/patient-portal">View My Appointments</Link>
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                                    <Link href="/">Back to Home</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // ✅ Main Booking Form JSX (This is now reachable)
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ... (rest of the multi-step form JSX remains the same) ... */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">MediCare Clinic</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
                    <p className="text-gray-600">Schedule your visit with our experienced medical professionals</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {stepNumber}
                            </div>
                            {stepNumber < 4 && (
                                <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {step === 1 && "Select Department & Doctor"}
                            {step === 2 && "Choose Date & Time"}
                            {step === 3 && "Patient Information"}
                            {step === 4 && "Confirm Appointment"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Choose the department and doctor you'd like to see"}
                            {step === 2 && "Pick your preferred date and time slot"}
                            {step === 3 && "Provide your contact information"}
                            {step === 4 && "Review and confirm your appointment details"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1: Select Department & Doctor */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label>Available Doctors</Label>
                                    <div className="grid gap-4">
                                        {filteredDoctors.map((doctor) => (
                                            <Card
                                                key={doctor.id}
                                                className={`cursor-pointer transition-colors ${selectedDoctor?.id === doctor.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:bg-gray-50"
                                                    }`}
                                                onClick={() => setSelectedDoctor(doctor)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={doctor.image || "/placeholder.svg"}
                                                            alt={doctor.name}
                                                            className="w-16 h-16 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                                <span>{doctor.experience} experience</span>
                                                                <span>⭐ {doctor.rating}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant="secondary">{doctor.department}</Badge>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Choose Date & Time */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label>Select Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !selectedDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    disabled={(date) =>
                                                        date < new Date() || !selectedDoctor?.availableDays.includes(format(date, "EEEE"))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {selectedDoctor && (
                                            <p className="text-sm text-gray-600">Available days: {selectedDoctor.availableDays.join(", ")}</p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Available Time Slots</Label>
                                        {selectedDate ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {timeSlots.map((slot) => (
                                                    <Button
                                                        key={slot.time}
                                                        variant={selectedTime === slot.time ? "default" : "outline"}
                                                        disabled={!slot.available}
                                                        onClick={() => setSelectedTime(slot.time)}
                                                        className="justify-center"
                                                    >
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {slot.time}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-8">Please select a date first</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            value={patientInfo.firstName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            value={patientInfo.lastName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={patientInfo.email}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={patientInfo.phone}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason for Visit</Label>
                                    <Textarea
                                        id="reason"
                                        value={patientInfo.reason}
                                        onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
                                        placeholder="Please describe your symptoms or reason for the appointment"
                                        rows={3}
                                    />
                                </div>

                                <Alert>
                                    <AlertDescription>
                                        If you're an existing patient, please use the same contact information from your previous visits.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Doctor:</span>
                                            <span className="font-medium">{selectedDoctor?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <span className="font-medium">{selectedDoctor?.department}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium">{selectedDate && format(selectedDate, "PPP")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-medium">{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Patient:</span>
                                            <span className="font-medium">
                                                {patientInfo.firstName} {patientInfo.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Contact:</span>
                                            <span className="font-medium">{patientInfo.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <Alert>
                                    <AlertDescription>
                                        Please arrive 15 minutes before your scheduled appointment time. Bring a valid ID and insurance card
                                        if applicable.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                                Back
                            </Button>

                            {step < 4 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !selectedDoctor) ||
                                        (step === 2 && (!selectedDate || !selectedTime)) ||
                                        (step === 3 &&
                                            (!patientInfo.firstName || !patientInfo.lastName || !patientInfo.email || !patientInfo.phone))
                                    }
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                    {isSubmitting ? "Booking..." : "Confirm Appointment"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}