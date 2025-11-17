"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function DoctorsLoginPage() {
  const router = useRouter();

  // Function passed to LoginForm
  const handleLoginSuccess = (user) => {
    console.log("Doctor logged in:", user);

    // Redirect after successful login
    router.push("/doctors/dashboard");
  };

  return (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
  );
}
