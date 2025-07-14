
"use client";
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface NewsMarqueeProps {
  headlines: string[];
  variant?: 'light' | 'dark';
  direction?: 'left' | 'right';
}

export function NewsMarquee({ headlines, variant = 'light', direction = 'left' }: NewsMarqueeProps) {
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
    ? 'bg-primary' 
    : 'bg-secondary';
    
  const textClasses = variant === 'dark' 
    ? 'text-primary-foreground' 
    : 'text-secondary-foreground';

  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';
  const animationClass2 = direction === 'left' ? 'animate-marquee2' : 'animate-marquee2-reverse';

  return (
    <div className={cn("relative py-4", containerClasses)}>
      <div className="relative w-full flex overflow-hidden">
        <p className={cn("whitespace-nowrap text-xl font-medium font-serif", textClasses, animationClass)}>
          {marqueeText}
        </p>
        <p className={cn("absolute top-0 whitespace-nowrap text-xl font-medium font-serif", textClasses, animationClass2)}>
            {marqueeText}
        </p>
      </div>
    </div>
  );
}
