import type { Metadata } from "next";
import { Literata } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const literata = Literata({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "CyruTech Capital",
  description: "Pioneering Venture Capital for Groundbreaking Tech Innovations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${literata.variable} font-serif antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}