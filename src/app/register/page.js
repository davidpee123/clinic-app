"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header" // <--- Imported Header component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPatient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  // ... (formData state remains the same)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    agreeToTerms: false,
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const handleInput = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage("");

    try {
      const res = await fetch("/api/register-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Redirect to login page with a success flag after registration
        window.location.href = "/login?registrationSuccess=true"; 
      } else {
        setServerMessage(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setServerMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Define progressWidth here to fix the error and use in style={{ width: ... }}
  const progressWidth = `${((step - 1) / 3) * 100}%`; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. HEADER COMPONENT: Imported from "@/components/Header" */}
      <Header />

      {/* 2. LOGIN PAGE-STYLE CONTENT CONTAINER */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        
        {/* Title and Subtitle (Mirroring the Login Page) */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h1>
          <p className="text-gray-600">Create your MediCare patient portal account</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>
        
        {/* Card and Steps */}
        <Card className="w-full shadow-2xl border-none rounded-xl"> {/* Changed to rounded-xl for consistency */}
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-sm uppercase tracking-widest text-blue-600 font-bold">
              Step {step} of 4
            </CardTitle>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => handleInput("firstName", e.target.value)} />
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => handleInput("lastName", e.target.value)} />
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInput("email", e.target.value)} />
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => handleInput("password", e.target.value)} />

                  <div className="pt-4 flex justify-end">
                    <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">Next</Button>
                  </div>
                </motion.div>
              )}
              
              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <Label>Phone</Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => handleInput("phone", e.target.value)} />
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dateOfBirth} onChange={(e) => handleInput("dateOfBirth", e.target.value)} />
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => handleInput("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>Back</Button>
                    <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">Next</Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => handleInput("address", e.target.value)} />
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => handleInput("city", e.target.value)} />
                  <Label>State</Label>
                  <Input value={formData.state} onChange={(e) => handleInput("state", e.target.value)} />

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>Back</Button>
                    <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">Next</Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <Label>Emergency Contact Name</Label>
                  <Input value={formData.emergencyContactName} onChange={(e) => handleInput("emergencyContactName", e.target.value)} />
                  <Label>Emergency Contact Phone</Label>
                  <Input type="tel" value={formData.emergencyContactPhone} onChange={(e) => handleInput("emergencyContactPhone", e.target.value)} />
                  <Label>Relationship</Label>
                  <Select value={formData.emergencyContactRelation} onValueChange={(v) => handleInput("emergencyContactRelation", v)}>
                    <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 pt-3">
                    <Checkbox checked={formData.agreeToTerms} onCheckedChange={(c) => handleInput("agreeToTerms", c)} />
                    <p className="text-sm text-gray-600">
                      I agree to the <Link href="/terms" className="text-blue-600 underline">terms</Link>.
                    </p>
                  </div>

                  {serverMessage && <p className="text-sm text-red-500">{serverMessage}</p>}

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>Back</Button>
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Finish & Register"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* "Already registered?" Link */}
        <div className="mt-6 text-sm text-gray-600 text-center">
          Already registered?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold"> 
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}