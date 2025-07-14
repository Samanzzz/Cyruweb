import { Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <a href="#" className="font-headline text-xl font-bold">
              CyruTech Capital
            </a>
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} CyruTech Capital. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Pioneering Venture Capital for Groundbreaking Tech Innovations.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
