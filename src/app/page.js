"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Shield,
  Heart,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

const heroSlides = [
  {
    image: "/images/hospitals/kafeel.png",
    title: "Excellence in Healthcare",
    subtitle:
      "Providing compassionate, comprehensive medical care with state-of-the-art technology and experienced professionals.",
    cta: "Book Appointment",
  },
  {
    image: "/medical-team-of-doctors-and-nurses-in-hospital-cor.jpg",
    title: "Expert Medical Team",
    subtitle:
      "Our board-certified physicians and specialists are dedicated to delivering personalized treatment plans.",
    cta: "Meet Our Doctors",
  },
  {
    image: "/modern-medical-equipment-and-technology-in-hospita.jpg",
    title: "Advanced Technology",
    subtitle: "Equipped with the latest medical technology to ensure accurate diagnosis and effective treatment.",
    cta: "Our Services",
  },
]

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Comprehensive heart care with advanced diagnostic and treatment options.",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Primary healthcare services for patients of all ages and conditions.",
  },
  {
    icon: Users,
    title: "Pediatrics",
    description: "Specialized medical care designed specifically for infants, children, and adolescents.",
  },
  {
    icon: Shield,
    title: "Emergency Care",
    description: "24/7 emergency services with rapid response and critical care capabilities.",
  },
]

const stats = [
  { number: "15,000+", label: "Patients Served" },
  { number: "50+", label: "Medical Specialists" },
  { number: "24/7", label: "Emergency Care" },
  { number: "98%", label: "Patient Satisfaction" },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediCare Clinic</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
                Doctors
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-4">
              {/* New Check-in Link */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/check-in" className="text-blue-600 hover:bg-blue-50">
                  Check In
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <span>Patient Login</span>
                </Link>
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/book-appointment">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* The rest of the page remains the same */}
      {/* Hero Slider */}
      <section id="home" className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="relative h-full">
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-8 text-balance opacity-90">{slide.subtitle}</p>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Comprehensive Healthcare Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              We offer a wide range of medical services with experienced specialists and modern facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-balance">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                About Us
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-balance">
                Trusted Healthcare Partner Since 1995
              </h2>
              <p className="text-lg text-gray-600 mb-6 text-pretty">
                MediCare Clinic has been serving our community for over 25 years, providing exceptional healthcare
                services with a commitment to excellence, compassion, and innovation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-gray-700">Board-certified physicians and specialists</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-gray-700">State-of-the-art medical equipment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-gray-700">Personalized treatment plans</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/modern-hospital-interior-with-medical-staff-and-pa.jpg"
                alt="About MediCare Clinic"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 text-balance">Ready to Schedule Your Appointment?</h2>
          <p className="text-xl text-blue-100 mb-8 text-balance">
            Take the first step towards better health. Book your appointment today and experience quality healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link href="/book-appointment">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediCare Clinic</span>
              </div>
              <p className="text-gray-400 text-pretty">
                Providing exceptional healthcare services with compassion and excellence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#doctors" className="text-gray-400 hover:text-white transition-colors">
                    Doctors
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">Cardiology</span>
                </li>
                <li>
                  <span className="text-gray-400">General Medicine</span>
                </li>
                <li>
                  <span className="text-gray-400">Pediatrics</span>
                </li>
                <li>
                  <span className="text-gray-400">Emergency Care</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">123 Healthcare Ave, Medical City</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">info@medicareClinic.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 MediCare Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}