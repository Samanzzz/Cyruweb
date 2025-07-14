import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Contact } from "@/components/contact";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
