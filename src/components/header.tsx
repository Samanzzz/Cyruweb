import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu } from 'lucide-react';
import { DemoForm } from "./demo-form";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bootcamp", label: "Bootcamp" },
  { href: "/unicorns", label: "Unicorns" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="text-xl font-bold text-foreground mr-6">
            CyruTech
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-primary text-foreground/60"
                >
                  {link.label}
                </Link>
            ))}
        </nav>

        <Dialog>
            <DialogTrigger asChild>
                <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
                    <Button>Request a Demo</Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request a Demo</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we'll get back to you to schedule a demo.
                    </DialogDescription>
                </DialogHeader>
                <DemoForm />
            </DialogContent>
        </Dialog>


        <div className="md:hidden flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-4 py-6">
                        {navLinks.map((link) => (
                           <Link
                              key={link.href}
                              href={link.href}
                              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {link.label}
                            </Link>
                        ))}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-4">Request a Demo</Button>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Request a Demo</DialogTitle>
                                    <DialogDescription>
                                        Fill out the form below and we'll get back to you to schedule a demo.
                                    </DialogDescription>
                                </DialogHeader>
                                <DemoForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
