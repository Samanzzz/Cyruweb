import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold">Careers</h1>
        <p className="mt-4 text-muted-foreground">
          Join our team of innovators.
        </p>
      </main>
      <Footer />
    </div>
  );
}
