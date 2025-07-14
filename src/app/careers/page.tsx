"use client";
import React, { useState } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Briefcase, Clock } from "lucide-react";
import { ApplicationForm } from "@/components/application-form";

const jobOpenings = [
  {
    title: "Senior Frontend Engineer",
    location: "Remote",
    type: "Full-time",
    description: "We are seeking an experienced Frontend Engineer to build and scale our user-facing applications. You will work with a modern tech stack and have a direct impact on our product.",
    responsibilities: [
      "Develop new user-facing features using React and Next.js.",
      "Build reusable components and front-end libraries for future use.",
      "Translate designs and wireframes into high-quality code.",
      "Optimize components for maximum performance across a vast array of web-capable devices and browsers."
    ],
    qualifications: [
      "5+ years of professional experience in frontend development.",
      "Proficient in React, Next.js, and TypeScript.",
      "Strong understanding of modern web technologies (HTML5, CSS3, JavaScript ES6+).",
      "Experience with RESTful APIs and modern authorization mechanisms."
    ]
  },
  {
    title: "Product Manager, AI/ML",
    location: "Remote",
    type: "Full-time",
    description: "Drive the product vision and strategy for our AI-powered features. You will work closely with engineering, design, and data science to deliver innovative solutions.",
     responsibilities: [
      "Define and communicate the product roadmap and strategy.",
      "Gather and prioritize product and customer requirements.",
      "Work with cross-functional teams to design, build and launch features.",
      "Analyze product performance and user feedback to iterate and improve."
    ],
    qualifications: [
      "3+ years of product management experience, preferably in an AI/ML or data-driven environment.",
      "Proven track record of managing all aspects of a successful product throughout its lifecycle.",
      "Strong problem-solving skills and willingness to roll up one’s sleeves to get the job done.",
      "Excellent written and verbal communication skills."
    ]
  },
  {
    title: "Venture Capital Analyst",
    location: "Remote",
    type: "Full-time",
    description: "Join our investment team to identify, evaluate, and support the next generation of tech unicorns. This is a unique opportunity to get in on the ground floor of a fast-paced VC.",
     responsibilities: [
      "Source and screen potential investment opportunities.",
      "Conduct due diligence on startups, including market analysis, competitive landscaping, and financial modeling.",
      "Prepare investment memos and present findings to the investment committee.",
      "Support portfolio companies and monitor their performance."
    ],
    qualifications: [
      "1-3 years of experience in venture capital, investment banking, or a related field.",
      "Strong analytical and financial modeling skills.",
      "Deep passion for technology and startups.",
      "Exceptional communication and networking skills."
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Join Our Team</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            We're looking for passionate innovators to help us build the future. Explore our open roles and find your next opportunity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Dialog>
            {jobOpenings.map((job) => (
              <DialogTrigger key={job.title} asChild onClick={() => setSelectedJob(job)}>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">{job.title}</CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 pt-2">
                      <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{job.type}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{job.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            ))}
            {selectedJob && (
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif font-bold text-foreground">{selectedJob.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-x-4 pt-2">
                      <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{selectedJob.type}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{selectedJob.location}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-6 max-h-[60vh] overflow-y-auto pr-4">
                  <div>
                    <h3 className="font-semibold text-xl font-serif mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {selectedJob.responsibilities.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-semibold text-xl font-serif mb-2">Qualifications</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {selectedJob.qualifications.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-semibold text-xl font-serif mb-2">Apply Now</h3>
                    <ApplicationForm jobTitle={selectedJob.title} />
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>

      </main>
      <Footer />
    </div>
  );
}
