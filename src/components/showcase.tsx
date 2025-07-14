
"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const unicornStartups = [
  {
    name: "SullDog Company",
    description: "Specializes in elevating businesses online with bespoke web development and design services.",
    image: "https://raw.githubusercontent.com/Samanzzz/Cyruweb/master/assets/images/logo/sulldog-logoo.png",
    details: {
      founded: 2021,
      overview: "SullDog Company is a premier digital agency that crafts beautiful, high-performance websites and web applications. They focus on creating a powerful online presence for their clients through a combination of cutting-edge design and robust development.",
      features: [
        "Custom Web & App Development",
        "UI/UX Design & Branding",
        "E-commerce Solutions",
        "Ongoing Maintenance & Support"
      ],
    }
  },
  {
    name: "Cloud Impala",
    description: "Provides data analytics solutions specifically designed for farmers and corporations to optimize their operations.",
    image: "https://raw.githubusercontent.com/Samanzzz/Cyruweb/master/assets/images/logo/impala-logo.png",
    details: {
      founded: 2020,
      overview: "Cloud Impala is at the forefront of agricultural technology (AgriTech). Their platform ingests vast amounts of data—from weather patterns to crop yields—and provides actionable insights for farmers and large agricultural corporations to increase efficiency and profitability.",
      features: [
        "Predictive Analytics for Crop Management",
        "Supply Chain Optimization",
        "Real-time Data Dashboards",
        "Sustainability & Yield Reporting"
      ],
    }
  },
  {
    name: "FeedSlack",
    description: "Delivers an advanced feedback system aimed at refining customer interactions for businesses online.",
    image: "https://raw.githubusercontent.com/Samanzzz/Cyruweb/master/assets/images/logo/feedslack.png",
    details: {
      founded: 2022,
      overview: "FeedSlack offers a comprehensive suite of tools for collecting, analyzing, and acting on customer feedback. By integrating seamlessly with existing platforms, it helps businesses understand customer sentiment and improve their products and services.",
      features: [
        "Multi-channel Feedback Collection",
        "AI-Powered Sentiment Analysis",
        "Customer Journey Mapping",
        "Automated Reporting & Alerts"
      ],
    }
  },
  {
    name: "AdverCal",
    description: "A marketing agency that offers customized marketing strategies with the unique option of direct executive collaboration.",
    image: "https://raw.githubusercontent.com/Samanzzz/Cyruweb/master/assets/images/logo/advercal.png",
    details: {
      founded: 2019,
      overview: "AdverCal redefines the agency model by providing bespoke marketing strategies coupled with unparalleled access to senior marketing executives. This unique approach ensures that clients receive expert guidance and hands-on strategy execution.",
      features: [
        "Fractional CMO Services",
        "Data-Driven Digital Marketing Campaigns",
        "Brand Strategy & Positioning",
        "Content Marketing & SEO"
      ],
    }
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
               <Dialog>
                <Card className="overflow-hidden h-full flex flex-col bg-card border rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <CardHeader className="p-0">
                    <Image
                      src={startup.image}
                      alt={`Logo for ${startup.name}`}
                      width={600}
                      height={400}
                      className="w-full h-48 object-contain p-4"
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">{startup.name}</h3>
                      <p className="text-muted-foreground flex-1 mb-4">{startup.description}</p>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-auto w-full hover:bg-primary hover:text-primary-foreground">Learn More</Button>
                      </DialogTrigger>
                  </CardContent>
                </Card>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                          <Image
                            src={startup.image}
                            alt={`Logo for ${startup.name}`}
                            width={100}
                            height={100}
                            className="w-24 h-24 object-contain p-2 border rounded-md"
                          />
                        <div className="flex-1">
                          <DialogTitle className="text-3xl font-serif font-bold text-foreground">{startup.name}</DialogTitle>
                          <DialogDescription>Founded in {startup.details.founded}</DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div>
                            <h3 className="font-semibold text-xl font-serif mb-2">Overview</h3>
                            <p className="text-muted-foreground">{startup.details.overview}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl font-serif mb-2">Key Features</h3>
                            <ul className="space-y-2">
                                {startup.details.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </DialogContent>
               </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
