import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    name: "Feed Slack",
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
  return (
    <section id="showcase" className="py-16 sm:py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Unicorn Startups</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From Vision to Unicorn: Our Journey. We have a team of developers who will identify your needs and provide you with solutions for them.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {unicornStartups.map((startup, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden h-full flex flex-col bg-card border-border hover:border-primary/50 transition-colors">
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
                        <Button variant="outline" className="mt-auto w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
