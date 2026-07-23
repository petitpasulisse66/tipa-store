'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface HeroSlide {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  imageUrl?: string | null;
  colorHex?: string | null;
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <div
      className="relative h-64 md:h-96 rounded-2xl overflow-hidden flex items-center px-8 md:px-16 text-white"
      style={{
        backgroundColor: slide.colorHex || '#3654f5',
        backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black/30 absolute inset-0" />
      <div className="relative z-10 max-w-lg">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{slide.title}</h1>
        <p className="text-sm md:text-lg mb-4 text-gray-100">{slide.subtitle}</p>
        {slide.buttonText && (
          <Link href={slide.buttonUrl || '/products'} className="btn-primary inline-block">
            {slide.buttonText}
          </Link>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
