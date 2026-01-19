import { Heart, MapPin, Phone, Mail  } from "lucide-react";

export default function Footer() {
  return (
           
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-black" />
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
                      <span className="text-gray-400">Lasu.edu lagos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400">+234 900 309 888 1</span>
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
  );
}
