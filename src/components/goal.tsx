"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Goal() {
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
      id="goal"
      className="py-16 sm:py-24 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container px-4">
        <div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-lg shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="text-left">
            <p className="text-primary font-semibold mb-2">Our Goal</p>
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl mb-8 font-serif">Get involved with CyruTech</h2>
            <div className="space-y-6 text-muted-foreground text-lg">
              <p>
                At CyruTech Capital, our overarching goal is to catalyze the growth and success of innovative technology startups. We engage with companies at various stages—from conceptual sparks to those with established products—aiming to propel them to new heights of development and market penetration. Our objective over a targeted three-month acceleration period is to ensure that each company not only refines its product offering but also significantly expands its user base and investment attractiveness.
              </p>
              <p>
                We provide an immersive environment where urgency meets opportunity—creating a breeding ground for breakthroughs and intense progress. Within this dynamic ecosystem, startups gain access to seasoned mentors, strategic partners, and potential investors, all unified in their commitment to the startup's success. This network, combined with our tailored guidance, helps founders unlock extraordinary levels of performance, often surpassing their own expectations of what they could achieve.
              </p>
              <p>
                By the end of their time with CyruTech Capital, our startups are positioned not just for immediate next steps, but for sustainable growth and leadership in the tech industry. We don’t just invest money; we invest in potential, turning visionary tech entrepreneurs into tomorrow’s industry leaders.
              </p>
            </div>
             <Button size="lg" className="mt-10">Book Your Appointment Now</Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
