import type { Metadata } from "next";
import { SUMMER_LIVE } from "./gate";

const title = "Summer Tech Academy 2027 | CyruTech";
const description = !SUMMER_LIVE
  ? "Hands-on summer tech programs for middle and high school students, on campus and online. Coming soon."
  : "Two-week summer tech programs for grades 6 to 12: web development, app development, AI, cybersecurity, data science and project management. On your school's campus or live online, June 21 to August 13, 2027.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://cyrutech.com/summer-2027" },
  openGraph: {
    title,
    description,
    url: "https://cyrutech.com/summer-2027",
    siteName: "CyruTech",
    type: "website",
    images: [{ url: "https://cyrutech.com/Cy-logo.png" }],
  },
  twitter: { card: "summary", title, description },
};

export default function SummerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
