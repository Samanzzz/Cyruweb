import Image from "next/image";
import Link from "next/link";
import { Rss } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  category: string;
  imageUrl: string;
}

// A simple, dependency-free XML parser for the TechCrunch RSS feed.
// This is fragile and tailored to the specific structure of the feed.
async function parseRss(rssText: string): Promise<Article[]> {
  const articles: Article[] = [];
  // Split the feed into individual <item> blocks
  const items = rssText.split('<item>');
  items.shift(); // Remove the part before the first <item>

  for (const item of items.slice(0, 4)) { // Limit to 4 articles
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const creatorMatch = item.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/);
    const categoryMatch = item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/);
    // Look for the media:content tag for the image
    const imageUrlMatch = item.match(/<media:content url="(.*?)"/);

    if (titleMatch && linkMatch && pubDateMatch && creatorMatch && categoryMatch && imageUrlMatch) {
      articles.push({
        title: titleMatch[1],
        link: linkMatch[1],
        pubDate: new Date(pubDateMatch[1]).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        creator: creatorMatch[1],
        category: categoryMatch[1],
        imageUrl: imageUrlMatch[1],
      });
    }
  }

  return articles;
}

async function getLatestNews() {
  try {
    const response = await fetch('https://techcrunch.com/feed/', {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const rssText = await response.text();
    const articles = await parseRss(rssText);
    return articles;
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", error);
    return []; // Return empty array on error
  }
}

export async function LatestNews() {
  const articles = await getLatestNews();

  if (articles.length === 0) {
    return null; // Don't render the section if there are no articles
  }

  return (
    <section id="latest-news" className="py-16 sm:py-24 bg-secondary">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-foreground sm:text-4xl">Latest News</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Stay updated with the latest happenings in the tech and startup world, powered by TechCrunch.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {articles.map((article) => (
            <Link href={article.link} key={article.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
              <Card className="overflow-hidden h-full flex flex-col bg-card border rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={article.imageUrl || "https://placehold.co/600x400.png"}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint="tech news"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">{article.category}</Badge>
                    <h3 className="text-lg font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    <span>{article.creator}</span> &middot; <span>{article.pubDate}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
