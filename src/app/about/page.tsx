import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4 text-muted-foreground">
          Learn more about CyruTech Capital.
        </p>
      </main>
      <Footer />
    </div>
  );
}
