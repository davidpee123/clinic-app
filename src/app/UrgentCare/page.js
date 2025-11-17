import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { HeartPulse, ChevronRight } from 'lucide-react';

// Component for the pill-shaped condition button
const ConditionPill = ({ title }) => (
    // The button shape and shadow match the image, using rounded-full for the pill effect
    <Link href={`/doctors?condition=${encodeURIComponent(title)}`} className="group flex justify-between items-center px-6 py-3 w-full bg-white border border-gray-300 rounded-full shadow-md hover:border-blue-500 hover:shadow-lg transition-all duration-200">
        <span className="text-base font-medium text-gray-800 group-hover:text-blue-700">
            {title}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-700 transition-transform group-hover:translate-x-1" />
    </Link>
);

// --- Main Page Component ---
const App = () => {
    // List of conditions extracted from the provided images
    const conditions = [
        "Abdominal Pain", "Acute bronchitis", "Allergy",
        "Chat 24/7", "Covid-19 Rx (Paxlovid)", "Dental Infection",
        "Ear Infection", "Flu (Influenza)", "Headache/Migraine",
        "HIV prevention/exposure", "Malaria", "Men's Health",
        "Mental health concerns", "Miscellaneous Health / OTHERS",
        "Nausea/Diarrhoea/Vomiting", "Oral herpes", "Paediatric (2-17 years)",
        "Pain relief", "PRESCRIPTION REFILL", "Red eye",
        "Sexually Transmitted Infections (STIs)", "Sinus Infection", "Skin/Nail/Hair",
        "Sore Throat/Strep A", "Stye", "Thrush (Oral)",
        "URI - Respiratory infection", "Urine Infection (UTI)", "Women's Health",
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    {/* Title Section (Matching the centered text in the image) */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                            Need an urgent care?
                        </h1>
                        <p className="max-w-4xl mx-auto text-base text-gray-600">
                            See, Speak or Text a doctor now Online! Seven days a week. Receive advice or treatment for any of the listed medical conditions. Book and consult with a doctor from anywhere on any device or web browser.
                        </p>
                    </div>

                    {/* Conditions Grid (The main focus, using a three-column layout) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                        {conditions.map((condition, index) => (
                            <ConditionPill key={index} title={condition} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;