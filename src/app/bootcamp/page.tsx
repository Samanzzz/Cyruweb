import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Bot, ShieldCheck, Globe, BarChart2, Smartphone } from "lucide-react";

const bootcamps = [
  {
    title: "Software Project Management",
    description: "Learn to plan, organize, and lead software projects using Agile and Scrum techniques.",
    date: "Due April 15, 2025",
    category: "Management",
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    title: "AI and Machine Learning Essentials",
    description: "Discover AI basics like neural networks and machine learning through real-world applications.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Bot className="w-8 h-8 text-primary" />,
  },
  {
    title: "Cybersecurity Basics",
    description: "Understand digital security, including threats, encryption, and protecting personal data.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
  },
  {
    title: "Web Development",
    description: "Build and design a website using HTML, CSS, and JavaScript for a complete online experience.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
  {
    title: "Data Science and Analytics",
    description: "Learn to analyze and visualize data for insights using tools like Python and Excel.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <BarChart2 className="w-8 h-8 text-primary" />,
  },
  {
    title: "App Development",
    description: "Create a simple mobile app, covering design, coding, and testing fundamentals.",
    date: "Dec 22, 2023",
    category: "Blog",
    icon: <Smartphone className="w-8 h-8 text-primary" />,
  },
];

export default function BootcampPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">CyruTech Bootcamp</h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Upskill and innovate with our expert-led tech bootcamps. Your journey into deep tech starts here.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bootcamps.map((bootcamp) => (
                <Card key={bootcamp.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="bg-secondary p-3 rounded-full mb-4">
                                {bootcamp.icon}
                            </div>
                            <Badge variant={bootcamp.category === 'Management' ? 'destructive' : 'secondary'}>{bootcamp.category}</Badge>
                        </div>
                        <CardTitle className="font-headline text-2xl">{bootcamp.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <CardDescription className="mb-4">{bootcamp.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-auto">{bootcamp.date}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
