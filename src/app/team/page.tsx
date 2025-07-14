import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold">Our Team</h1>
        <p className="mt-4 text-muted-foreground">
          Meet the minds behind CyruTech Capital.
        </p>
      </main>
      <Footer />
    </div>
  );
}
