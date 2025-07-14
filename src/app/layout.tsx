
import type { Metadata } from "next";
import { Inter, Literata } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const literata = Literata({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "CyruTech Capital",
  description: "Pioneering Venture Capital for Groundbreaking Tech Innovations",
  icons: {
    icon: '/Cy-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${literata.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
