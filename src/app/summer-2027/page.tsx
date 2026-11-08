"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, MotionConfig } from "framer-motion";
import { Bell, Check, Mail } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// When the gate is closed this branch is dead code, so the full page is not in the public bundle.
const Full = process.env.NODE_ENV === "development" || process.env.SUMMER_2027 === "live" ? dynamic(() => import("./full"), { ssr: false }) : null;

const FORM_KEY = "318db7ff-a710-47ee-9852-d56ada295461"; // Web3Forms public access key, same as the site's other forms
const EMAIL = "team@cyrutech.com";

export default function Summer2027Page() {
  return Full ? <Full /> : <ComingSoon />;
}

function ComingSoon() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    f.append("access_key", FORM_KEY);
    f.append("subject", "Summer 2027: notify me when registration opens");
    f.append("from_name", "CyruTech Summer 2027 page");
    setSending(true);
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: f });
      if (!(await r.json()).success) throw new Error();
      setDone(true);
    } catch {
      toast({ variant: "destructive", title: "Couldn't send", description: `Please try again, or email ${EMAIL}.` });
    } finally { setSending(false); }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 grid place-items-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" />
          <motion.div className="container max-w-2xl py-24 text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">Coming soon</span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground">Summer Tech Academy 2027</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Hands-on summer tech programs for middle and high school students, on campus and online. Full details and registration are on the way.
            </p>
            {done ? (
              <p className="mt-10 inline-flex items-center gap-2 text-primary font-medium"><Check className="w-5 h-5" />Thanks! We&apos;ll email you when it opens.</p>
            ) : (
              <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="notify-email" className="sr-only">Email</label>
                <Input id="notify-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="h-11" />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                <Button type="submit" size="lg" disabled={sending} className="h-11"><Bell className="w-4 h-4 mr-2" />{sending ? "Sending…" : "Notify me"}</Button>
              </form>
            )}
            <p className="mt-8 text-sm text-muted-foreground">
              Schools and districts planning ahead can reach us now at{" "}
              <a href={`mailto:${EMAIL}`} className="text-primary underline underline-offset-4 inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{EMAIL}</a>.
            </p>
          </motion.div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
