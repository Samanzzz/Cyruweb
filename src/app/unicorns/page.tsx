import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Showcase } from "@/components/showcase";

export default function UnicornsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Showcase />
      </main>
      <Footer />
    </div>
  );
}
