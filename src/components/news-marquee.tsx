
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

  return (
    <div className={cn("relative flex w-full overflow-hidden", containerClasses)}>
      <div className={cn("py-4 flex-shrink-0 flex items-center", animationClass)}>
          <p className={cn("whitespace-nowrap text-xl font-serif", textClasses)}>
            {marqueeText}
          </p>
      </div>
      <div className={cn("absolute top-0 py-4 flex-shrink-0 flex items-center", animationClass)}>
          <p className={cn("whitespace-nowrap text-xl font-serif", textClasses)}>
            {marqueeText}
          </p>
      </div>
    </div>
  );
}
