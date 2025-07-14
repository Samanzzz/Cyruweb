import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="container px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Architecting the Unthinkable. Funding the Future.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          We don't just invest. We forge futures with audacious founders at the nexus of technology and revolution.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg">Ignite Your Vision</Button>
          <Button size="lg" variant="outline">Explore Our Manifesto</Button>
        </div>
      </div>
    </section>
  );
}
