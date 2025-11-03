"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPatient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
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
        window.location.href = "/patient-portal";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Heart className="text-white w-4 h-4" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">MediCare Patient Registration</h1>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-gray-800">
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
                <Label>First Name</Label>
                <Input value={formData.firstName} onChange={(e) => handleInput("firstName", e.target.value)} />
                <Label>Last Name</Label>
                <Input value={formData.lastName} onChange={(e) => handleInput("lastName", e.target.value)} />
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => handleInput("email", e.target.value)} />
                <Label>Password</Label>
                <Input type="password" value={formData.password} onChange={(e) => handleInput("password", e.target.value)} />

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
                    className="bg-blue-600 hover:bg-blue-700"
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

      <div className="mt-6 text-sm text-gray-600">
        Already registered?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
