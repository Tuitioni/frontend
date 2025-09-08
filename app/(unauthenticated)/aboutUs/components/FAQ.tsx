"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the payment process work?",
    answer:
      "For teachers, you'll pay 30% of your first month or 15% of the first 3 months. For students, payment is arranged directly with your teacher after our confirmation.",
  },
  {
    question: "How do I find the right teacher/student?",
    answer:
      "We have a matching system that considers teaching style, experience, and subject expertise to ensure the best fit for both teachers and students.",
  },
  {
    question: "What subjects are available?",
    answer:
      "We offer a wide range of subjects including Mathematics, Sciences, Languages, and more. The availability depends on our current teacher pool.",
  },
  {
    question: "How are the lessons conducted?",
    answer:
      "Lessons can be conducted online or in-person, depending on the mutual agreement between teacher and student.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-base md:text-lg font-medium">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 text-sm md:text-base text-gray-600 border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
