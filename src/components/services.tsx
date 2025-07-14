import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Megaphone, Zap, Scale } from "lucide-react";

const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary-foreground" />,
    title: "Venture Acceleration",
    description: "More than capital, we provide the strategic firepower to scale ideas into industry-defining titans.",
  },
  {
    icon: <Scale className="w-8 h-8 text-primary-foreground" />,
    title: "Ecosystem Forging",
    description: "Connect with a curated network of pioneers, innovators, and market leaders to build your dynasty.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-secondary">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">Our Catalyst Platform</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We are architects of growth, providing the tools and network to build empires.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service) => (
            <Card key={service.title} className="text-center border shadow-sm hover:shadow-xl transition-shadow duration-300 bg-card">
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
          ))}
        </div>
      </div>
    </section>
  );
}
