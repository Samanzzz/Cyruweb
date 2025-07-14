
"use client";
import React, { useState, useEffect } from 'react';

interface NewsMarqueeProps {
  headlines: string[];
  variant?: 'light' | 'dark';
}

export function NewsMarquee({ headlines, variant = 'light' }: NewsMarqueeProps) {
  const [marqueeText, setMarqueeText] = useState("");

  useEffect(() => {
    if (headlines && headlines.length > 0) {
      // Create a long string of headlines separated by a visual element
      const text = headlines.join("  •  ") + "  •  ";
      // Repeat it to ensure it's long enough for a smooth marquee effect
      setMarqueeText(text.repeat(5));
    } else {
      // Fallback text if headlines fail to load
      const fallbackText = "Latest news headlines are currently unavailable. • Innovation · Seed Funding · Venture Capital · Scalability · Disruption · IPO · Unicorn · MVP · Product-Market Fit · Angel Investor ·";
      setMarqueeText(fallbackText.repeat(5));
    }
  }, [headlines]);
  
  const containerClasses = variant === 'dark' 
    ? 'bg-gray-800' 
    : 'bg-secondary';
    
  const textClasses = variant === 'dark' 
    ? 'text-white' 
    : 'text-secondary-foreground';

  return (
    <div className={`relative py-4 ${containerClasses}`}>
      <div className="relative w-full flex overflow-hidden">
        <p className={`animate-marquee whitespace-nowrap text-xl font-medium ${textClasses}`}>
          {marqueeText}
        </p>
        <p className={`absolute top-0 animate-marquee2 whitespace-nowrap text-xl font-medium ${textClasses}`}>
            {marqueeText}
        </p>
      </div>
    </div>
  );
}
