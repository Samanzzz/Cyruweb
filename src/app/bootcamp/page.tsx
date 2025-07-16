
"use client";
import React, { useState } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code, Bot, ShieldCheck, Globe, BarChart2, Smartphone, CheckCircle } from "lucide-react";
import { EnrollmentForm } from '@/components/enrollment-form';
import { motion } from 'framer-motion';

const bootcamps = [
  {
    title: "Software Project Management",
    description: "Learn to plan, organize, and lead software projects using Agile and Scrum techniques.",
    date: "Due April 15, 2025",
    category: "Management",
    icon: <Code className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "This comprehensive bootcamp equips you with the essential skills to manage software projects from conception to completion. You'll dive deep into methodologies like Agile and Scrum, learning how to lead teams, manage resources, and deliver projects on time and within budget.",
      topics: ["Agile & Scrum Methodologies", "Project Planning & Estimation", "Risk Management", "Team Leadership & Communication", "Quality Assurance"],
      prerequisites: "No prior project management experience required, but a basic understanding of software development concepts is helpful.",
    },
  },
  {
    title: "AI and Machine Learning Essentials",
    description: "Discover AI basics like neural networks and machine learning through real-world applications.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Bot className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "Step into the world of Artificial Intelligence. This course demystifies AI and machine learning, covering fundamental concepts like neural networks, supervised and unsupervised learning, and data modeling. You'll work on practical projects to see how AI is applied in the real world.",
      topics: ["Introduction to AI", "Neural Networks & Deep Learning", "Supervised & Unsupervised Learning", "Data Preprocessing", "Building AI Models"],
      prerequisites: "Basic Python programming knowledge is recommended.",
    },
  },
  {
    title: "Cybersecurity Basics",
    description: "Understand digital security, including threats, encryption, and protecting personal data.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <ShieldCheck className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "In an increasingly digital world, cybersecurity is more important than ever. This bootcamp provides a foundational understanding of digital security, covering common threats, network security, encryption techniques, and best practices for protecting personal and corporate data.",
      topics: ["Cyber Threat Landscape", "Network Security Fundamentals", "Cryptography & Encryption", "Secure Coding Practices", "Incident Response"],
      prerequisites: "No prior cybersecurity experience is needed. A general understanding of computer networks is beneficial.",
    },
  },
  {
    title: "Web Development",
    description: "Build and design a website using HTML, CSS, and JavaScript for a complete online experience.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Globe className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "Learn the core technologies of the web. This bootcamp takes you through building a complete website from the ground up. You will master HTML for structure, CSS for design, and JavaScript for interactivity, creating a responsive and engaging web experience.",
      topics: ["HTML5 & CSS3", "Responsive Design", "JavaScript & The DOM", "Intro to Web Frameworks", "Hosting & Deployment"],
      prerequisites: "No prior coding experience required. This course is perfect for beginners.",
    },
  },
  {
    title: "Data Science and Analytics",
    description: "Learn to analyze and visualize data for insights using tools like Python and Excel.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <BarChart2 className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "Unlock the power of data. This bootcamp teaches you how to collect, clean, analyze, and visualize data to derive actionable insights. You will get hands-on experience with popular tools like Python, Pandas, and data visualization libraries to solve real-world problems.",
      topics: ["Data Collection & Cleaning", "Exploratory Data Analysis", "Statistical Analysis", "Data Visualization Techniques", "Introduction to Machine Learning"],
      prerequisites: "Familiarity with basic spreadsheet functions (e.g., in Excel or Google Sheets) is recommended.",
    },
  },
  {
    title: "App Development",
    description: "Create a simple mobile app, covering design, coding, and testing fundamentals.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Smartphone className="w-8 h-8 text-primary-foreground" />,
    details: {
      overview: "Bring your app idea to life. This introductory course covers the full lifecycle of mobile app development. You'll learn about UI/UX design principles, fundamental coding concepts for mobile platforms, and how to test and prepare your app for launch.",
      topics: ["Mobile UI/UX Design", "Introduction to Mobile Programming", "Working with APIs", "App Testing & Debugging", "App Store Submission"],
      prerequisites: "Some prior programming experience is helpful but not strictly required.",
    },
  },
];

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

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BootcampPage() {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedBootcamp, setSelectedBootcamp] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEnrollClick = (bootcampTitle: string) => {
    setSelectedBootcamp(bootcampTitle);
    setShowEnrollmentForm(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    if(!open) {
      setShowEnrollmentForm(false);
      setSelectedBootcamp("");
    }
    setIsDialogOpen(open);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <motion.div 
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">CyruTech Bootcamp</h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Upskill and innovate with our expert-led tech bootcamps. Your journey into deep tech starts here.
            </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
            {bootcamps.map((bootcamp) => (
              <Dialog key={bootcamp.title} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                  <motion.div variants={itemVariants}>
                    <Card className="flex flex-col overflow-hidden border-transparent shadow-none hover:bg-muted/50 transition-colors duration-300 cursor-pointer h-full bg-card group">
                        <CardHeader className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="bg-primary/10 text-primary p-3 rounded-md mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {React.cloneElement(bootcamp.icon, { className: 'w-6 h-6' })}
                                </div>
                                <Badge variant={bootcamp.category === 'Management' ? 'destructive' : 'secondary'}>{bootcamp.category}</Badge>
                            </div>
                            <CardTitle className="text-2xl font-serif">{bootcamp.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between p-6 pt-0">
                          <CardDescription className="mb-4 text-base">{bootcamp.description}</CardDescription>
                          <p className="text-xs text-muted-foreground mt-auto">{bootcamp.date}</p>
                        </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-primary text-primary-foreground p-3 rounded-md">
                             {React.cloneElement(bootcamp.icon, { className: 'w-6 h-6' })}
                        </div>
                        <DialogTitle className="text-3xl font-serif font-bold text-foreground">{bootcamp.title}</DialogTitle>
                    </div>
                  </DialogHeader>
                  
                  {showEnrollmentForm && selectedBootcamp === bootcamp.title ? (
                      <EnrollmentForm bootcampName={bootcamp.title} onBack={() => setShowEnrollmentForm(false)} />
                  ) : (
                    <>
                      <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-xl font-serif mb-2">Overview</h3>
                            <p className="text-muted-foreground">{bootcamp.details.overview}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl font-serif mb-2">What You'll Learn</h3>
                            <ul className="space-y-2">
                                {bootcamp.details.topics.map((topic) => (
                                    <li key={topic} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-muted-foreground">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold text-xl font-serif mb-2">Prerequisites</h3>
                            <p className="text-muted-foreground">{bootcamp.details.prerequisites}</p>
                        </div>
                      </div>
                       <div className="mt-8 text-center">
                            <Button size="lg" onClick={() => handleEnrollClick(bootcamp.title)}>Enroll Now</Button>
                        </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
