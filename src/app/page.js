"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header";
import Link from "next/link"
import Footer from "@/components/footer"
import HowItWorksSection from '@/components/HowItWorksSection';
import FeatureDemoSection from '@/components/FeatureDemoSection';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Shield,
  Heart,
  Stethoscope,
  Phone,
} from "lucide-react"

const heroSlides = [
  // SLIDE 1: Existing Image Slide
  {
    type: "image",
    image: "/images/hospitals/kafeel.png",
    title: "Excellence in Healthcare",
    subtitle:
      "Providing compassionate, comprehensive medical care with state-of-the-art technology and experienced professionals.",
    cta: "Book Appointment",
    ctaLink: "/doctors",
  },

  // SLIDE 2: NEW Form/CTA Slide 1
  {
    type: "form",
    leftTitle: "Your Health Journey Starts Now. Book with Ease!",
    leftSubtitle: "Secure your time slot instantly. Use our platform to connect with your preferred specialist and manage your calendar.",
    leftCta: "Schedule Appointment",
    leftCtaLink: "/doctors",
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

// Stats section removed from original code, but keeping the array just in case
// const stats = [
//   { number: "15,000+", label: "Patients Served" },
//   { number: "50+", label: "Medical Specialists" },
//   { number: "24/7", label: "Emergency Care" },
//   { number: "98%", label: "Patient Satisfaction" },
// ]

export default function HomePage() {

  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = heroSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="min-h-screen bg-background">

      <Header />

      {/* Hero Section: Reduced height slightly for better mobile viewing */}
      <section id="home" className="relative h-[550px] sm:h-[600px] overflow-hidden"> 
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            {slide.type === "image" ? (
              // --- IMAGE SLIDE CONTENT ---
              <div className="relative h-full">
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" /> {/* Increased overlay for better text contrast */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    {/* Text size reduced slightly on mobile (from text-5xl to text-4xl) */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 text-balance">
                      {slide.title}
                    </h1>
                    {/* Subtitle size reduced slightly on mobile (from text-xl to text-lg) */}
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-balance opacity-90">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      // Padding slightly reduced for mobile
                      className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 py-3" 
                      asChild
                    >
                      <Link href={slide.ctaLink || "#"}>{slide.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // --- FORM/CTA SLIDE CONTENT ---
              <div className="relative h-full bg-[#1b61fc] flex items-center justify-center px-4 py-8 md:py-16">
                {/* Grid now explicitly stacks (col-span-1) on mobile */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 w-full"> 
                  {/* Left side: Text and CTA */}
                  <div className="text-center lg:text-left p-2 md:p-4 order-2 lg:order-1"> {/* order-2/1 ensures form is at the top on small screens */}
                    {/* Text size reduced slightly on mobile */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-balance">
                      {slide.leftTitle}
                    </h1>
                    {/* Subtitle size reduced slightly on mobile */}
                    <p className="text-base sm:text-lg md:text-xl text-white mb-6 md:mb-8 max-w-lg lg:max-w-none mx-auto lg:mx-0 text-balance">
                      {slide.leftSubtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-[#ff6900] hover:bg-[#d97726] text-base sm:text-lg px-6 py-3"
                      asChild
                    >
                      <Link href={slide.leftCtaLink || "#"}>{slide.leftCta}</Link>
                    </Button>
                  </div>

                  {/* Right side: The Sign-Up/Lead Form */}
                  <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-2xl max-w-sm mx-auto w-full order-1 lg:order-2"> {/* order-1/2 ensures the form is prominent on mobile */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
                      Request a Free Callback
                    </h3>
                    <form className="space-y-3"> {/* Reduced vertical spacing */}
                      <div>
                        <label htmlFor={`hero-name-${index}`} className="sr-only">Name</label>
                        <input
                          type="text"
                          id={`hero-name-${index}`}
                          placeholder="Full Name"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" // Reduced padding and text size
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`hero-phone-${index}`} className="sr-only">Phone</label>
                        <input
                          type="tel"
                          id={`hero-phone-${index}`}
                          placeholder="Phone Number"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" // Reduced padding and text size
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`hero-email-${index}`} className="sr-only">Email</label>
                        <input
                          type="email"
                          id={`hero-email-${index}`}
                          placeholder="Email Address (Optional)"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" // Reduced padding and text size
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`hero-terms-${index}`}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`hero-terms-${index}`} className="ml-2 text-xs text-gray-600"> {/* Text size reduced for smaller screens */}
                          I agree to receive health updates.
                        </label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#ff6900] hover:bg-[#d97726] text-white font-bold py-2 sm:py-3 px-4 rounded-md transition-colors"
                      >
                        Send Request
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Navigation Arrows: Position remains fine for mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators: Position remains fine for mobile */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

      {/* Services Section: Reduced top/bottom padding to py-12 on mobile */}
      <section id="services" className="py-8 sm:py-12 md:py-16"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16"> {/* Reduced margin bottom on mobile */}
            <Badge variant="secondary" className="mb-2">
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-balance">Comprehensive Healthcare Services</h2> {/* Reduced text size on mobile */}
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto text-balance"> {/* Reduced text size on mobile */}
              We offer a wide range of medical services with experienced specialists and modern facilities.
            </p>
          </div>

          {/* Grid remains responsive (defaults to single column on mobile) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> 
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 sm:p-8"> {/* Reduced padding for card content */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 text-balance">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <main>
        {/* HowItWorksSection - Assumed to be responsive internally */}
        <HowItWorksSection />
      </main>

      {/* FeatureDemoSection - Assumed to be responsive internally */}
      <FeatureDemoSection />

      {/* About Section: Reduced top/bottom padding to py-8 on mobile */}
      <section id="about" className="py-8 sm:py-12 md:py-12 bg-gray-50"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid remains responsive (defaults to single column on mobile) */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center"> 
            <div>
              <Badge variant="secondary" className="mb-2">
                About Us
              </Badge>
              {/* Text size reduced on mobile */}
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-balance">
                Trusted Healthcare Partner Since 1995
              </h2>
              {/* Text size reduced on mobile */}
              <p className="text-base sm:text-lg text-gray-600 mb-4 md:mb-6 text-pretty">
                MediCare Clinic has been serving our community for over 25 years, providing exceptional healthcare
                services with a commitment to excellence, compassion, and innovation.
              </p>
              <div className="space-y-3"> {/* Reduced vertical spacing */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">Board-certified physicians and specialists</span> {/* Text size reduced on mobile */}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">State-of-the-art medical equipment</span> {/* Text size reduced on mobile */}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">Personalized treatment plans</span> {/* Text size reduced on mobile */}
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0"> {/* Added top margin for mobile spacing */}
              <img
                src="/modern-hospital-interior-with-medical-staff-and-pa.jpg"
                alt="About MediCare Clinic"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section: Reduced top/bottom padding to py-12 on mobile */}
      <section className="py-12 sm:py-16 bg-[#1c398e]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">Ready to Schedule Your Appointment?</h2> {/* Text size reduced on mobile */}
          <p className="text-base sm:text-xl text-blue-100 mb-6 text-balance"> {/* Text size reduced on mobile */}
            Take the first step towards better health. Book your appointment today and experience quality healthcare.
          </p>
          {/* Default flex-col ensures stacking on mobile, sm:flex-row keeps it horizontal on larger phones/screens */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"> 
            <Button size="lg" variant="secondary" className="text-base px-6 py-3" asChild>
              <Link href="/book-appointment">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-6 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}