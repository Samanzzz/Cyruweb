import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const unicornStartups = [
  {
    name: "InnovateAI",
    description: "Revolutionizing machine learning for enterprise solutions.",
    image: "https://placehold.co/600x400.png",
    hint: "tech logo",
  },
  {
    name: "QuantumLeap",
    description: "Building the next generation of quantum computing hardware.",
    image: "https://placehold.co/600x400.png",
    hint: "abstract data",
  },
  {
    name: "BioSynth",
    description: "Pioneering sustainable materials through synthetic biology.",
    image: "https://placehold.co/600x400.png",
    hint: "nature technology",
  },
  {
    name: "NextGen Robotics",
    description: "Automating industries with intelligent robotic systems.",
    image: "https://placehold.co/600x400.png",
    hint: "robot arm",
  },
  {
    name: "HelioPower",
    description: "Developing breakthrough solar energy capture and storage.",
    image: "https://placehold.co/600x400.png",
    hint: "solar panels",
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="py-16 sm:py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">Our Unicorn Showcase</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A selection of industry-defining companies we've backed.
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
                  <Card className="overflow-hidden h-full flex flex-col">
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
                        <CardTitle className="font-headline text-xl mb-2">{startup.name}</CardTitle>
                        <p className="text-muted-foreground flex-1">{startup.description}</p>
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
