"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Scale, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Venture Acceleration",
    description: "More than capital, we provide the strategic firepower to scale ideas into industry-defining titans.",
  },
  {
    icon: <Scale className="w-8 h-8 text-primary" />,
    title: "Ecosystem Forging",
    description: "Connect with a curated network of pioneers, innovators, and market leaders to build your dynasty.",
  },
  {
    icon: <Handshake className="w-8 h-8 text-primary" />,
    title: "Strategic Partnerships",
    description: "We help you forge strategic partnerships that open new markets and create lasting value.",
  },
];

export function Services() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };


  return (
    <motion.section
      id="services"
      className="py-16 sm:py-24 bg-secondary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-foreground sm:text-4xl">Our Catalyst Platform</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We are architects of growth, providing the tools and network to build empires.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
             <motion.div key={service.title} variants={itemVariants}>
                <Card className="text-center border shadow-sm hover:shadow-xl transition-shadow duration-300 bg-card h-full">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl pt-4">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
