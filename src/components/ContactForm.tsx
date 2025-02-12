'use client';

import { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setFormState({
        ...formState,
        error: 'Please complete the captcha verification'
      });
      return;
    }

    setFormState({ ...formState, isSubmitting: true, error: null });

    try {
      if (!process.env.NEXT_PUBLIC_WEB3FORMS_KEY) {
        throw new Error('Web3Forms API key is not configured');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          ...formData,
          'h-captcha-response': captchaToken,
          from_name: 'QEDIT Contact Form',
          subject: `Sender: ${formData.name} from ${formData.company}`,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        });
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: `There was a problem submitting your form: ${error instanceof Error ? error.message : 'Please try again.'}`
      });
    }
  };

  if (formState.isSubmitted) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-green-800 text-xl font-semibold mb-2">Thank you for your message!</h3>
        <p className="text-green-700">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#38b1df] focus:outline-none focus:ring-1 focus:ring-[#38b1df]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#38b1df] focus:outline-none focus:ring-1 focus:ring-[#38b1df]"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          required
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#38b1df] focus:outline-none focus:ring-1 focus:ring-[#38b1df]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#38b1df] focus:outline-none focus:ring-1 focus:ring-[#38b1df]"
        />
      </div>

      <div className="flex justify-center">
        <HCaptcha
          sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
          onVerify={handleCaptchaVerify}
          reCaptchaCompat={false}
        />
      </div>

      {formState.error && (
        <div className="text-red-600 text-sm">
          {formState.error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="inline-flex justify-center rounded-full border-2 border-[#38b1df] bg-white px-8 py-3 text-lg font-normal text-[#38b1df] hover:bg-[#38b1df] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#38b1df] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {formState.isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
} 