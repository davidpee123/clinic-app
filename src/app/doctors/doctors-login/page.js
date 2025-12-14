"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";

export default function DoctorsLoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
        setLoading(false);
        return;
      }

      const user = data.user;

      // 2️⃣ Verify this user is a doctor
      const { data: doctorProfile, error: doctorError } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", user.id)
        .single();

      if (doctorError || !doctorProfile) {
        await supabase.auth.signOut();
        setMessage("❌ Access denied. Doctor account not found.");
        setLoading(false);
        return;
      }

      // 3️⃣ Redirect to doctor dashboard
      router.push("/doctors/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex justify-center items-center py-12 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100"
        >
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Doctor Login
          </h1>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 transition-colors py-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.startsWith("❌") || message.startsWith("⚠️")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
