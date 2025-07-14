"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const unicornStartups = [
  {
    name: "SullDog Company",
    description: "Specializes in elevating businesses online with bespoke web development and design services.",
    image: "https://placehold.co/600x400.png",
    hint: "dog logo",
  },
  {
    name: "Cloud Impala",
    description: "Provides data analytics solutions specifically designed for farmers and corporations to optimize their operations.",
    image: "https://placehold.co/600x400.png",
    hint: "cloud analytics",
  },
  {
    name: "FeedSlack",
    description: "Delivers an advanced feedback system aimed at refining customer interactions for businesses online.",
    image: "https://placehold.co/600x400.png",
    hint: "feedback chat",
  },
  {
    name: "AdverCal",
    description: "A marketing agency that offers customized marketing strategies with the unique option of direct executive collaboration.",
    image: "https://placehold.co/600x400.png",
    hint: "marketing chart",
  },
];

export function Showcase() {
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
      id="showcase"
      className="py-16 sm:py-24 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Unicorn Startups</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From Vision to Unicorn: Our Journey. We have a team of developers who will identify your needs and provide you with solutions for them.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {unicornStartups.map((startup, index) => (
             <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="overflow-hidden h-full flex flex-col bg-card border rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={startup.image}
                    alt={`Logo for ${startup.name}`}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint={startup.hint}
                  />
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{startup.name}</h3>
                    <p className="text-muted-foreground flex-1 mb-4">{startup.description}</p>
                    <Button variant="outline" className="mt-auto w-full hover:bg-primary hover:text-primary-foreground">Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
