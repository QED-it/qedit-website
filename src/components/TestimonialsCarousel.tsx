'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Testimonial {
  quote: string;
  author: string;
  image: string;
  link: string;
}

interface TestimonialsCarouselProps {
  title: string;
  items: Testimonial[];
  autoPlayInterval?: number;
}

export default function TestimonialsCarousel({ 
  title, 
  items, 
  autoPlayInterval = 7000
}: TestimonialsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval]);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">
          {title}
        </h2>
        
        <div className="relative">
          {/* Current Slide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2">
              <blockquote className="text-2xl font-semibold mb-6">
              <span>"</span>{items[currentSlide].quote}<span>"</span>
              </blockquote>
              <p className="text-gray-600">
                {items[currentSlide].author}
              </p>
              <Link 
                href={items[currentSlide].link}
                className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more →
              </Link>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64">
                <Image
                  src={items[currentSlide].image}
                  alt={`Illustration for ${items[currentSlide].author}`}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 256px, 256px"
                />
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 