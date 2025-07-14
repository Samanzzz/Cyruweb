import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-background to-[hsl(158_41%_95%)]">
        <Hero />
        <Services />
        <Showcase />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
