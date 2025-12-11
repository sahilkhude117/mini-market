"use client";

import { useState, useEffect, useRef } from "react";
import { marketCarouselItems } from "@/data/data";
import MarketCarouselItem from "./MarketCarouselItem";

const AutoScrollCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % marketCarouselItems.length);
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {marketCarouselItems.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <MarketCarouselItem {...item} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {marketCarouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? "w-8 h-2 bg-[#0b1f3a]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          scrollToIndex(
            (currentIndex - 1 + marketCarouselItems.length) %
              marketCarouselItems.length
          )
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 text-[#0b1f3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => scrollToIndex((currentIndex + 1) % marketCarouselItems.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 text-[#0b1f3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default AutoScrollCarousel;
