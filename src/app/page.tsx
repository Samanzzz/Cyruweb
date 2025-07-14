
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Goal } from "@/components/goal";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { NewsMarquee } from "@/components/news-marquee";

// Static headlines to replace the live API call for GitHub Pages deployment.
const staticHeadlines = [
  "Tech Startups See Record Funding in Q2",
  "Venture Capital Firms Focus on AI and Machine Learning",
  "The Rise of Sustainable Tech Innovations",
  "Key Trends in the SaaS Industry for 2024",
  "Biotech Companies Secure Major Investment Rounds",
  "How Web3 is Shaping the Future of the Internet",
  "Fintech Disruptors Challenge Traditional Banking",
  "Cybersecurity Becomes a Top Priority for Investors",
  "The Future of Work: Remote Collaboration Tools Surge",
  "E-commerce Growth Continues to Accelerate Post-Pandemic"
];


export default async function Home() {
  const headlines = staticHeadlines;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Hero headlines={headlines} />
        <NewsMarquee headlines={headlines} variant="dark" direction="right" />
        <Services />
        <Showcase />
        <Goal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
