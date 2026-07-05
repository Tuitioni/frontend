'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does the payment process work?',
    answer:
      "For teachers, you'll pay 30% of your first month or 15% of the first 3 months. For students, payment is arranged directly with your teacher after our confirmation.",
  },
  {
    question: 'How do I find the right teacher/student?',
    answer:
      'We have a matching system that considers teaching style, experience, and subject expertise to ensure the best fit for both teachers and students.',
  },
  {
    question: 'What subjects are available?',
    answer:
      'We offer a wide range of subjects including Mathematics, Sciences, Languages, and more. The availability depends on our current teacher pool.',
  },
  {
    question: 'How are the lessons conducted?',
    answer:
      'Lessons can be conducted online or in-person, depending on the mutual agreement between teacher and student.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-2 w-2 rounded-full bg-amber" />
          Got questions?
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Everything you need to know about learning with Tuitioni.
        </p>
      </div>
      <div className="space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm transition-shadow duration-300 hover:shadow-soft"
            >
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="font-display text-base font-bold md:text-lg">{faq.question}</span>
                <span
                  className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-colors ${
                    isOpen ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
                  }`}
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border px-6 py-5 text-sm text-muted-foreground md:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
