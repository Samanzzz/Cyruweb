import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Goal } from "@/components/goal";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Showcase />
        <Goal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}