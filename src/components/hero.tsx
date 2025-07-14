import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-white">
      <div className="container px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Pioneering Venture Capital for Groundbreaking Tech Innovations
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
          Custom Tech Solutions and Streamlined Marketing
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg">Ignite Your Vision</Button>
          <Button size="lg" variant="outline">Explore Our Manifesto</Button>
        </div>
      </div>
    </section>
  );
}
