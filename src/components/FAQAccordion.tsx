'use client';
import { useState } from 'react';

interface FAQAccordionProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FAQAccordion({ questions }: FAQAccordionProps) {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {questions.map((faq, index) => (
        <div 
          key={index}
          className="border-b border-gray-200 last:border-b-0"
        >
          <button
            onClick={() => toggleQuestion(index)}
            className="w-full py-6 text-left flex justify-between items-center focus:outline-none"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {faq.question}
            </h2>
            <span className="ml-6 flex-shrink-0">
              <div className={`w-10 h-10 flex items-center justify-center bg-black transition-transform duration-200 ${
                openQuestions.has(index) ? 'transform rotate-90' : ''
              }`}>
                <span className={`text-white text-2xl transition-transform duration-200 ${
                  openQuestions.has(index) ? '-rotate-90' : ''
                }`}>
                  {openQuestions.has(index) ? '−' : '+'}
                </span>
              </div>
            </span>
          </button>
          
          <div 
            className={`transition-all duration-200 overflow-hidden ${
              openQuestions.has(index) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-6">
              <p 
                className="text-gray-600 text-lg"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 