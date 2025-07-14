
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Goal } from "@/components/goal";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { NewsMarquee } from "@/components/news-marquee";

interface Article {
  title: string;
}

// Fetches headlines from NewsAPI
async function getLatestNewsHeadlines(): Promise<string[]> {
  const apiKey = 'c136fd4db02b48ac8c6911f3edc4c506';
  // More relevant query for a VC firm
  const query = 'startup OR technology OR "venture capital"';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=popularity&language=en&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store' // Fetch fresh data on every request
    });

    if (!response.ok) {
      // NewsAPI might return a 4xx or 5xx error with a JSON body
      const errorData = await response.json();
      throw new Error(`Failed to fetch news: ${response.status} - ${errorData.message}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI returned an error: ${data.message}`);
    }

    // Extract titles from the articles
    return data.articles.map((article: Article) => article.title);
  } catch (error) {
    console.error("Error fetching or parsing news from NewsAPI:", error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  const headlines = await getLatestNewsHeadlines();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Hero headlines={headlines} />
        <NewsMarquee headlines={headlines} variant="dark" />
        <Services />
        <Showcase />
        <Goal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
