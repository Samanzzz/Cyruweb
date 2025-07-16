
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StartupForm } from "@/components/startup-form";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function IgnitePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Ignite Your Vision</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Have a groundbreaking idea? We want to hear about it. Fill out the form below to tell us about your venture, and let's explore how we can build the future together.
          </p>
        </motion.div>
        <motion.div
          className="max-w-2xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
             <div className="bg-card p-6 sm:p-8 rounded-lg border">
                <StartupForm />
            </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
