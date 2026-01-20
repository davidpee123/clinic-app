"use client"
import Header from "@/components/Header"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Swal from 'sweetalert2' // ADDED
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Mail, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check for registration success
    if (searchParams.get("registered") === "true" || searchParams.get("registrationSuccess") === "true") {
      setShowRegistrationSuccess(true)
    }

    const wasRedirected = searchParams.get("next") || searchParams.get("redirect")

    if (wasRedirected) {
      Swal.fire({
        title: 'Error',
        text: 'Login Required',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#193cb8',
        buttonsStyling: true,
        customClass: {
          popup: 'rounded-xl',
          title: 'text-2xl font-semibold text-gray-700',
        }
      });
    }
    // ----------------------------------------
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Invalid credentials. Please check your email or password.")
        setIsSubmitting(false)
        return
      }

      // If middleware sent them here, redirect them BACK to where they wanted to go
      const redirectTo = searchParams.get("next") || searchParams.get("redirect") || "/patient-portal"
      router.replace(redirectTo)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Login</h1>
          <p className="text-gray-600">Sign in to access your patient portal</p>
        </div>

        {showRegistrationSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Registration successful! You can now sign in with your credentials.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            For Admin login, please use the{" "}
            <Link href="/staff-login" className="text-blue-600 hover:underline">
              staff portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}