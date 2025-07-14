import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { Goal } from "@/components/goal";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

interface Article {
  title: string;
}

// A simple, dependency-free XML parser for the TechCrunch RSS feed.
async function parseRss(rssText: string): Promise<Article[]> {
  const articles: Article[] = [];
  const items = rssText.split('<item>');
  items.shift(); // Remove the part before the first <item>

  for (const item of items) { 
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    if (titleMatch) {
      articles.push({
        title: titleMatch[1],
      });
    }
  }

  return articles;
}

async function getLatestNewsHeadlines() {
  try {
    const response = await fetch('https://techcrunch.com/feed/', {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const rssText = await response.text();
    const articles = await parseRss(rssText);
    return articles.map(a => a.title);
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", error);
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
        <Services />
        <Showcase />
        <Goal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
