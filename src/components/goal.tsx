import { Button } from "@/components/ui/button";

export function Goal() {
  return (
    <section id="goal" className="py-16 sm:py-24">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Our Goal</h2>
            <div className="space-y-6 text-muted-foreground">
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
             <Button size="lg" className="mt-8">Book Your Appointment Now</Button>
          </div>
          <div className="order-1 lg:order-2">
             <div className="bg-muted rounded-lg p-8 h-full flex items-center justify-center">
                <h3 className="text-2xl font-bold text-center text-secondary-foreground">Get involved with CyruTech</h3>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
