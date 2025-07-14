
"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
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

  const marqueeWords = "Innovation · Seed Funding · Venture Capital · Scalability · Disruption · IPO · Unicorn · MVP · Product-Market Fit · Angel Investor · Series A · Growth Hacking · Tech · Entrepreneurship · Exit Strategy · Pitch Deck · Due Diligence · Term Sheet · Burn Rate ·".repeat(5);

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
            {marqueeWords}
          </p>
           <p className="absolute top-0 animate-marquee2 whitespace-nowrap text-xl text-secondary-foreground font-medium">
             {marqueeWords}
           </p>
        </div>
      </div>
    </section>
  );
}
