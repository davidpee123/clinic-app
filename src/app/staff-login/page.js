"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"   // ✅ you forgot this import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function StaffLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    // Hardcoded credentials for demo
    const correctUsername = "admin"
    const correctPassword = "password123"

    if (username === correctUsername && password === correctPassword) {
      const staffData = {
        firstName: "Jane",
        lastName: "Doe",
        role: "receptionist",
      }
      localStorage.setItem("staffData", JSON.stringify(staffData))
      router.push("/staff-portal")
    } else {
      setError("Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

            {/* Navbar Links */}
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

      {/* Login Card */}
      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Staff Login</CardTitle>
            <CardDescription>
              Enter your username and password to access the staff portal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password123"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Log In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
