
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  headlines: string[];
}

export function Hero({ headlines }: HeroProps) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-24 sm:py-32 lg:pt-40 bg-white overflow-hidden">
      <motion.div
        className="container px-4 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Pioneering Venture Capital for Groundbreaking Tech Innovations
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl"
        >
          Custom Tech Solutions and Streamlined Marketing
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-start gap-4"
        >
          <Link href="/ignite" passHref>
            <Button size="lg">Ignite Your Vision</Button>
          </Link>
          <Link href="/unicorns" passHref>
            <Button size="lg" variant="outline">Explore Our Manifesto</Button>
          </Link>
        </motion.div>
      </motion.div>
       <div className="relative mt-20 sm:mt-24 py-4">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="relative w-full flex overflow-hidden">
          <p className="animate-marquee whitespace-nowrap text-xl text-secondary-foreground font-medium">
            {marqueeText}
          </p>
           <p className="absolute top-0 animate-marquee2 whitespace-nowrap text-xl text-secondary-foreground font-medium">
             {marqueeText}
           </p>
        </div>
      </div>
    </section>
  );
}
