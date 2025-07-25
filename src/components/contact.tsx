"use client";
import { ContactForm } from "./contact-form";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const locations = ["San Diego", "New York", "Miami", "Los Angeles", "San Francisco", "Seattle"];

export function Contact() {
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
  return (
    <motion.section
      id="contact"
      className="py-16 sm:py-24 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">CONTACT US</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Reach out to us for any development inquiries.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">How Can We Help?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+18582471788" className="text-foreground hover:text-primary transition-colors">+1 (858) 247-1788</a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:team@cyrutech.com" className="text-foreground hover:text-primary transition-colors">team@cyrutech.com</a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Our Locations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <div key={location} className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-card p-6 sm:p-8 rounded-lg border">
            <ContactForm />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
