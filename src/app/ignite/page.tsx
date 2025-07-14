
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StartupForm } from "@/components/startup-form";

export default function IgnitePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Ignite Your Vision</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Have a groundbreaking idea? We want to hear about it. Fill out the form below to tell us about your venture, and let's explore how we can build the future together.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
             <div className="bg-card p-6 sm:p-8 rounded-lg border">
                <StartupForm />
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
