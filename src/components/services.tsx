import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Megaphone } from "lucide-react";

const services = [
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Custom Tech Solutions",
    description: "From concept to launch, we provide bespoke technology development to bring your vision to life.",
  },
  {
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    title: "Streamlined Marketing",
    description: "Strategic marketing and branding that cuts through the noise and delivers measurable results.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-primary/5">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">Our Expertise</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We provide more than just capital. We're partners in growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service) => (
            <Card key={service.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                  {service.icon}
                </div>
                <CardTitle className="font-headline text-2xl pt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
