"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

export default function RegisterDoctorForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    const { full_name, email, phone, specialization, password } = formData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone,
            specialization,
            role: "doctor",
          },
        },
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
        return;
      }

      /**
       * IMPORTANT:
       * - Your DATABASE TRIGGER creates the doctors row automatically
       * - We DO NOT manually insert into doctors table here
       */

      if (!data.session) {
        // Email confirmation required
        setMessage("✅ Account created! Please check your email to verify.");
      } else {
        // Instant sign-in
        setMessage("✅ Account created successfully!");
      }

      // Give user feedback before redirect
      setTimeout(() => {
        router.push("/doctors/doctors-login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-gray-100"
      >
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Doctor Registration
          </h1>
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Dr. John Doe"
            required
            className="mt-1"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@email.com"
            required
            className="mt-1"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234..."
            className="mt-1"
          />
        </div>

        {/* Specialization */}
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Cardiology"
            required
            className="mt-1"
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 py-3"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </Button>

        {/* Message */}
        {message && (
          <p
            className={`text-center font-medium ${
              message.startsWith("❌")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}