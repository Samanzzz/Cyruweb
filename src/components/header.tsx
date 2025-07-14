import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <a href="#" className="font-headline text-xl font-bold text-primary">
            CyruTech Capital
          </a>
        </div>
        <nav className="flex items-center space-x-4">
          <Button className="font-bold bg-accent hover:bg-accent/90 text-accent-foreground">Book a Demo</Button>
        </nav>
      </div>
    </header>
  );
}
