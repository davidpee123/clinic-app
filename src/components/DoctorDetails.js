"use client";
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    id: 1,
    question: "Does Dr. David accept my insurance?",
    answer: "Dr. David accepts most major insurance providers including Aetna, Cigna, and Blue Cross Blue Shield. Please call the practice directly at 080XXXXXXXX to verify your specific plan."
  },
  {
    id: 2,
    question: "Which hospital is Dr. David affiliated with?",
    answer: "Dr David is primarily affiliated with General Hospital, Port Harcourt and Babatelehealth, offering both in-person and video consultations."
  },
  {
    id: 3,
    question: "What practice does Dr. David work with?",
    answer: "Dr. David is the lead physician at Baba Hubs, a specialized primary care practice focusing on comprehensive patient care."
  },
  {
    id: 4,
    question: "Which board certifications does Dr. David have?",
    answer: "Dr. David is board-certified in Internal Medicine by the Nigerian Medical Association (NMA) and has advanced certifications in telehealth practices."
  },
  {
    id: 5,
    question: "What are some common reasons for patients to see Dr. David?",
    answer: "Patients commonly seek appointments for routine checkups, chronic disease management (e.g., hypertension, diabetes), minor illnesses, and preventative care counseling."
  },
  {
    id: 6,
    question: "What languages does Dr. David speak?",
    answer: "Dr. David is fluent in English, Efik, and Nigerian Pidgin. Appointments are available in all three languages."
  },
  {
    id: 7,
    question: "How do patients rate Dr. David in reviews?",
    answer: "Dr. David has an excellent patient satisfaction rate, with a high percentage of patients giving 5-star ratings for care, knowledge, and wait time."
  },
];

const DoctorDetails = ({ doctor }) => {
  // State to track which FAQ item is currently open (stores its ID)
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id); // Close if already open, otherwise open the new one
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-2">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
        Frequently Asked Questions
      </h2>

      {faqs.map((item) => (
        <div 
          key={item.id} 
          className="border-b border-gray-200 last:border-b-0"
        >
          {/* Question/Header */}
          <button
            className="flex justify-between items-center w-full py-4 text-left focus:outline-none transition duration-150 ease-in-out hover:bg-gray-50"
            onClick={() => toggleAccordion(item.id)}
            aria-expanded={openId === item.id}
          >
            <span className="text-base font-medium text-gray-700">{item.question}</span>
            {openId === item.id ? (
              <FaMinus className="text-blue-600 w-4 h-4 transition-transform" />
            ) : (
              <FaPlus className="text-blue-600 w-4 h-4 transition-transform" />
            )}
          </button>

          {/* Answer/Content */}
          {openId === item.id && (
            <div className="pb-4 pr-6">
              <p className="text-sm text-gray-600">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DoctorDetails;