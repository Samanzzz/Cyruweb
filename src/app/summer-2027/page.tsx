"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import {
  Globe, Smartphone, Bot, ShieldCheck, BarChart2, Users, CalendarDays, Clock, Share2, Check, Plus, X,
  AlertTriangle, School, Home, Laptop, GraduationCap, ChevronRight, Link2, Send, Trophy, Wrench, Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PROGRAM, SESSIONS, TRACKS, INTERESTS, SCHEDULES, SCHOOL_MODELS, INCLUDED, FAQ, type Track } from "./program";

const ICONS = { web: Globe, app: Smartphone, ai: Bot, cyber: ShieldCheck, data: BarChart2, pm: Users };
const GRADES = [6, 7, 8, 9, 10, 11, 12];
const NAV = [["tracks", "Tracks"], ["calendar", "Calendar"], ["day", "A day"], ["schools", "For schools"], ["plan", "Your plan"], ["faq", "FAQ"]];
type Pick = { track: string; session: number };
const trackById = (id: string) => TRACKS.find(t => t.id === id);
const sessionLabel = (n: number) => SESSIONS.find(s => s.n === n)?.label ?? "";
const gradeText = (t: Track) => `Grades ${t.grades[0]}–${t.grades[1]}`;

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
function Section({ id, eyebrow, title, intro, children, className }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-32 py-16 md:py-24", className)}>
      <div className="container">
        <motion.div className="max-w-3xl mb-10" variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">{eyebrow}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
          {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(PROGRAM.starts).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick(); const t = setInterval(tick, 60000); return () => clearInterval(t);
  }, []);
  if (left === null) return <div className="h-[76px]" aria-hidden />;
  const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
  if (!left) return <p className="text-lg font-semibold text-primary">Summer 2027 is underway.</p>;
  return (
    <div className="flex items-end gap-3" aria-label={`${d} days, ${h} hours and ${m} minutes until Session 1`}>
      {[[d, "days"], [h, "hours"], [m, "min"]].map(([v, l]) => (
        <div key={l as string} className="rounded-lg border bg-card px-4 py-2 text-center min-w-[76px]">
          <div className="text-3xl font-serif font-bold tabular-nums text-foreground">{v}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{l}</div>
        </div>
      ))}
      <span className="text-sm text-muted-foreground pb-2">until Session 1</span>
    </div>
  );
}

async function shareLink(url: string, title: string, toast: ReturnType<typeof useToast>["toast"]) {
  try {
    if (navigator.share) { await navigator.share({ title, url }); return; }
  } catch { return; }
  try { await navigator.clipboard.writeText(url); toast({ title: "Link copied", description: "Paste it anywhere to share." }); }
  catch { window.prompt("Copy this link:", url); }
}

export default function Summer2027Page() {
  const { toast } = useToast();
  const [grade, setGrade] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [plan, setPlan] = useState<Pick[]>([]);
  const [mode, setMode] = useState<"onsite" | "online">("onsite");
  const [activeNav, setActiveNav] = useState("tracks");

  // plan from a shared link (?plan=web-development.1,cybersecurity.3), else from this browser; track from #track=<id>
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("plan");
    let start: Pick[] = [];
    if (q) start = q.split(",").map(p => { const [track, s] = p.split("."); return { track, session: Number(s) }; });
    else { try { start = JSON.parse(localStorage.getItem("cyru-summer-2027-plan") || "[]"); } catch { } }
    setPlan(start.filter(p => trackById(p.track)?.sessions.includes(p.session)));
    const openFromHash = () => { const m = /track=([a-z-]+)/.exec(window.location.hash); if (m && trackById(m[1])) setOpen(m[1]); };
    openFromHash(); window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);
  useEffect(() => { try { localStorage.setItem("cyru-summer-2027-plan", JSON.stringify(plan)); } catch { } }, [plan]);

  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActiveNav(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    els.forEach(e => io.observe(e)); return () => io.disconnect();
  }, []);

  const scored = useMemo(() => TRACKS.map(t => {
    const fitsGrade = grade === null || (grade >= t.grades[0] && grade <= t.grades[1]);
    const hits = t.interests.filter(i => interests.includes(i)).length;
    return { t, fitsGrade, hits };
  }).sort((a, b) => Number(b.fitsGrade) - Number(a.fitsGrade) || b.hits - a.hits), [grade, interests]);
  const anyFilter = grade !== null || interests.length > 0;
  const best = anyFilter ? scored.find(s => s.fitsGrade && (interests.length === 0 || s.hits > 0))?.t.id : undefined;

  const inPlan = (track: string, session: number) => plan.some(p => p.track === track && p.session === session);
  const toggle = (track: string, session: number) => {
    const t = trackById(track)!;
    if (inPlan(track, session)) { setPlan(plan.filter(p => !(p.track === track && p.session === session))); return; }
    setPlan([...plan, { track, session }].sort((a, b) => a.session - b.session));
    toast({ title: "Added to your plan", description: `${t.title}, ${SESSIONS.find(s => s.n === session)?.name} (${sessionLabel(session)})` });
  };
  const clashes = SESSIONS.filter(s => plan.filter(p => p.session === s.n).length > 1).map(s => s.n);
  const planUrl = () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    return plan.length ? `${base}?plan=${plan.map(p => `${p.track}.${p.session}`).join(",")}#plan` : base;
  };
  const openTrack = (id: string | null) => {
    setOpen(id);
    history.replaceState(null, "", id ? `#track=${id}` : window.location.pathname + window.location.search);
  };
  const current = open ? trackById(open) : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <section className="relative overflow-hidden border-b">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_60%)]" />
            <div className="container py-16 md:py-28 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
              <motion.div variants={fade} initial="hidden" animate="visible">
                <Badge variant="secondary" className="mb-6 text-sm"><Sparkles className="w-3.5 h-3.5 mr-1.5" />Registration opens {PROGRAM.registrationOpens}</Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground">Summer Tech Academy 2027</h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                  Two-week, hands-on programs where students in {PROGRAM.grades.toLowerCase()} build real websites, apps, AI models and more, then show them off on the last day. On your school&apos;s campus or live online.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" asChild><a href="#tracks">Find the right track <ChevronRight className="w-4 h-4 ml-1" /></a></Button>
                  <Button size="lg" variant="outline" asChild><a href="#schools"><School className="w-4 h-4 mr-2" />For schools</a></Button>
                  <Button size="lg" variant="ghost" onClick={() => shareLink(`${window.location.origin}${window.location.pathname}`, "CyruTech Summer Tech Academy 2027", toast)}><Share2 className="w-4 h-4 mr-2" />Share</Button>
                </div>
                <div className="mt-10"><Countdown /></div>
              </motion.div>
              <motion.dl className="grid grid-cols-2 gap-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
                {[
                  [CalendarDays, "Jun 21 – Aug 13", "Four 2-week sessions"],
                  [GraduationCap, "6 tracks", PROGRAM.grades],
                  [Users, `Up to ${PROGRAM.classSize.onsite}`, "students per class, 2 instructors"],
                  [Laptop, "2 formats", "On campus or live online"],
                ].map(([Icon, big, small]) => {
                  const I = Icon as typeof CalendarDays;
                  return (
                    <motion.div key={big as string} variants={fade} className="rounded-xl border bg-card p-5">
                      <I className="w-5 h-5 text-primary mb-3" />
                      <dt className="text-xl font-serif font-bold text-foreground">{big as string}</dt>
                      <dd className="text-sm text-muted-foreground mt-1">{small as string}</dd>
                    </motion.div>
                  );
                })}
              </motion.dl>
            </div>
          </section>

          {/* Section nav */}
          <nav aria-label="On this page" className="sticky top-16 z-30 border-b bg-background/90 backdrop-blur">
            <div className="container flex items-center gap-1 overflow-x-auto py-2">
              {NAV.map(([id, label]) => (
                <a key={id} href={`#${id}`} className={cn("whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors", activeNav === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  {label}{id === "plan" && plan.length > 0 && <span className="ml-1.5 rounded-full bg-background/20 px-1.5 text-xs">{plan.length}</span>}
                </a>
              ))}
            </div>
          </nav>

          {/* Tracks */}
          <Section id="tracks" eyebrow="Six tracks" title="Find the right track" intro="Pick a grade and what the student is into. The best match rises to the top; open any track for the full day-by-day plan.">
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-8 space-y-5">
              <div>
                <p className="text-sm font-medium mb-2">Grade in fall 2027</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Grade">
                  {GRADES.map(g => (
                    <button key={g} onClick={() => setGrade(grade === g ? null : g)} aria-pressed={grade === g}
                      className={cn("h-10 min-w-10 px-3 rounded-full border text-sm font-medium transition-colors", grade === g ? "bg-primary text-primary-foreground border-primary" : "hover:border-foreground/40")}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Interests</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
                  {INTERESTS.map(i => {
                    const on = interests.includes(i);
                    return (
                      <button key={i} onClick={() => setInterests(on ? interests.filter(x => x !== i) : [...interests, i])} aria-pressed={on}
                        className={cn("h-9 px-4 rounded-full border text-sm transition-colors", on ? "bg-primary/10 text-primary border-primary" : "hover:border-foreground/40")}>
                        {on && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}{i}
                      </button>
                    );
                  })}
                </div>
              </div>
              {anyFilter && <button onClick={() => { setGrade(null); setInterests([]); }} className="text-sm text-primary underline underline-offset-4">Clear choices</button>}
            </div>

            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {scored.map(({ t, fitsGrade }) => {
                  const I = ICONS[t.icon];
                  return (
                    <motion.button layout key={t.id} onClick={() => openTrack(t.id)} initial={{ opacity: 0 }} animate={{ opacity: fitsGrade ? 1 : 0.45 }} transition={{ duration: 0.3 }}
                      className={cn("group relative text-left rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", best === t.id && "ring-2 ring-primary")}>
                      {best === t.id && <Badge className="absolute -top-3 left-6">Best match</Badge>}
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-lg bg-primary/10 text-primary p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><I className="w-6 h-6" /></div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary">{gradeText(t)}</Badge>
                          <span className="text-xs text-muted-foreground">{t.level}</span>
                        </div>
                      </div>
                      <h3 className="mt-5 text-2xl font-serif font-bold text-foreground">{t.title}</h3>
                      <p className="mt-2 text-muted-foreground">{t.tagline}</p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {SESSIONS.map(s => (
                          <span key={s.n} className={cn("text-xs rounded px-2 py-1 border", t.sessions.includes(s.n) ? "border-primary/40 text-primary bg-primary/5" : "text-muted-foreground/50 line-through")}>S{s.n}</span>
                        ))}
                      </div>
                      {!fitsGrade && <p className="mt-3 text-xs text-muted-foreground">Not offered for grade {grade}</p>}
                      <span className="mt-5 inline-flex items-center text-sm font-medium text-primary">See the full plan <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </Section>

          {/* Calendar */}
          <Section id="calendar" eyebrow="Calendar" title="Four sessions, June 21 to August 13" intro="Each session is two weeks, Monday to Friday. Tap a session under any track to add it to your plan." className="bg-muted/40">
            <div className="md:hidden space-y-3">
              {TRACKS.map(t => {
                const I = ICONS[t.icon];
                return (
                  <div key={t.id} className="rounded-xl border bg-card p-4">
                    <button onClick={() => openTrack(t.id)} className="flex items-center gap-3 text-left mb-3">
                      <I className="w-4 h-4 text-primary shrink-0" />
                      <span><span className="font-medium">{t.title}</span> <span className="text-xs text-muted-foreground">{gradeText(t)}</span></span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      {SESSIONS.map(s => {
                        const offered = t.sessions.includes(s.n), on = inPlan(t.id, s.n);
                        return offered ? (
                          <button key={s.n} onClick={() => toggle(t.id, s.n)} aria-pressed={on}
                            className={cn("rounded-lg border px-3 py-2 text-left text-sm transition-colors", on ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:bg-primary/10")}>
                            <span className="font-medium flex items-center gap-1">{on ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}{s.name}</span>
                            <span className={cn("text-xs", on ? "opacity-80" : "text-muted-foreground")}>{s.label}</span>
                          </button>
                        ) : (
                          <div key={s.n} className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground/50"><span className="block">{s.name}</span><span className="text-xs">Not offered</span></div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden md:block overflow-x-auto rounded-xl border bg-card">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-muted-foreground w-[28%]">Track</th>
                    {SESSIONS.map(s => (
                      <th key={s.n} className="p-4 text-left">
                        <div className="font-serif font-bold text-base text-foreground">{s.name}</div>
                        <div className="font-normal text-muted-foreground">{s.label}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRACKS.map(t => {
                    const I = ICONS[t.icon];
                    return (
                      <tr key={t.id} className="border-b last:border-0">
                        <td className="p-4">
                          <button onClick={() => openTrack(t.id)} className="flex items-center gap-3 text-left hover:text-primary">
                            <I className="w-4 h-4 text-primary shrink-0" />
                            <span><span className="font-medium">{t.title}</span><br /><span className="text-xs text-muted-foreground">{gradeText(t)}</span></span>
                          </button>
                        </td>
                        {SESSIONS.map(s => {
                          const offered = t.sessions.includes(s.n), on = inPlan(t.id, s.n);
                          return (
                            <td key={s.n} className="p-2">
                              {offered ? (
                                <button onClick={() => toggle(t.id, s.n)} aria-pressed={on} aria-label={`${on ? "Remove" : "Add"} ${t.title}, ${s.name}`}
                                  className={cn("w-full h-11 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors", on ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 text-primary hover:bg-primary/10")}>
                                  {on ? <><Check className="w-4 h-4" />In plan</> : <><Plus className="w-4 h-4" />Add</>}
                                </button>
                              ) : <div className="h-11 grid place-items-center text-muted-foreground/40">–</div>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {SESSIONS.filter(s => s.note).map(s => <p key={s.n} className="mt-4 text-sm text-muted-foreground"><b className="text-foreground">{s.name}:</b> {s.note}</p>)}
          </Section>

          {/* A day */}
          <Section id="day" eyebrow="A day in the program" title="What a day looks like" intro="Every day pairs one new idea with plenty of time to build. Switch formats to compare.">
            <div className="inline-flex rounded-full border p-1 mb-8" role="tablist">
              {(["onsite", "online"] as const).map(m => (
                <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                  className={cn("px-5 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {m === "onsite" ? <School className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}{SCHEDULES[m].label}
                </button>
              ))}
            </div>
            <p className="mb-6 text-sm text-muted-foreground inline-flex items-center gap-2"><Clock className="w-4 h-4" />{SCHEDULES[mode].hours}, Monday to Friday</p>
            <AnimatePresence mode="wait">
              <motion.ol key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="relative border-l-2 border-primary/20 ml-3 space-y-6 max-w-3xl">
                {SCHEDULES[mode].blocks.map(b => (
                  <li key={b.time} className="pl-8 relative">
                    <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                    <div className="flex flex-wrap items-baseline gap-x-4">
                      <span className="font-mono text-sm text-primary w-14">{b.time}</span>
                      <span className="font-semibold text-foreground">{b.title}</span>
                    </div>
                    <p className="text-muted-foreground mt-1 sm:ml-[4.5rem]">{b.detail}</p>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </Section>

          {/* Schools */}
          <Section id="schools" eyebrow="For schools and districts" title="Bring the academy to your students" intro="Schools can host any track on their own campus, share teaching with their staff, or give their students a private online class." className="bg-muted/40">
            <div className="grid gap-6 md:grid-cols-3">
              {SCHOOL_MODELS.map((m, i) => (
                <motion.div key={m.title} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08 }} className="rounded-xl border bg-card p-6 flex flex-col">
                  <span className="text-sm font-mono text-primary">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-serif font-bold text-foreground">{m.title}</h3>
                  <p className="mt-3 text-muted-foreground flex-1">{m.detail}</p>
                  <p className="mt-5 text-sm border-t pt-4"><span className="text-muted-foreground">Best for: </span>{m.best}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 rounded-xl border bg-card p-6 md:p-8">
              <h3 className="text-xl font-serif font-bold text-foreground mb-5">Every program includes</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {INCLUDED.map(x => <li key={x} className="flex gap-3"><Check className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-muted-foreground">{x}</span></li>)}
              </ul>
            </div>
          </Section>

          {/* Plan */}
          <Section id="plan" eyebrow="Your plan" title="Build your summer and ask for a quote" intro={`Add tracks from the cards or the calendar, then send it to us. We reply within two business days. Early registration closes ${PROGRAM.earlyDeadline}.`}>
            <PlanBuilder plan={plan} clashes={clashes} onRemove={(p) => toggle(p.track, p.session)} onClear={() => setPlan([])} planUrl={planUrl} />
          </Section>

          {/* FAQ */}
          <Section id="faq" eyebrow="Questions" title="Frequently asked questions" className="bg-muted/40">
            <Accordion type="single" collapsible className="max-w-3xl rounded-xl border bg-card px-6">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`q${i}`} className={i === FAQ.length - 1 ? "border-b-0" : ""}>
                  <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-8 text-muted-foreground">Something else? Email <a className="text-primary underline underline-offset-4" href={`mailto:${PROGRAM.contactEmail}`}>{PROGRAM.contactEmail}</a> or call <a className="text-primary underline underline-offset-4" href={`tel:${PROGRAM.contactPhone.replace(/[^+\d]/g, "")}`}>{PROGRAM.contactPhone}</a>.</p>
          </Section>
        </main>
        <Footer />

        {/* Floating plan button */}
        <AnimatePresence>
          {plan.length > 0 && activeNav !== "plan" && (
            <motion.a href="#plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg">
              <CalendarDays className="w-4 h-4" />Your plan ({plan.length})
            </motion.a>
          )}
        </AnimatePresence>

        {/* Track detail */}
        <Dialog open={!!current} onOpenChange={o => !o && openTrack(null)}>
          {current && <TrackDetail t={current} inPlan={inPlan} toggle={toggle}
            share={() => shareLink(`${window.location.origin}${window.location.pathname}#track=${current.id}`, `${current.title}, CyruTech Summer 2027`, toast)} />}
        </Dialog>
      </div>
    </MotionConfig>
  );
}

function TrackDetail({ t, inPlan, toggle, share }: { t: Track; inPlan: (t: string, s: number) => boolean; toggle: (t: string, s: number) => void; share: () => void }) {
  const [day, setDay] = useState(0);
  const I = ICONS[t.icon];
  return (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
      <div className="p-6 md:p-8 border-b bg-muted/40">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary text-primary-foreground p-3"><I className="w-6 h-6" /></div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-serif font-bold">{t.title}</DialogTitle>
              <DialogDescription className="mt-1">{gradeText(t)} · {t.level} · 10 days</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <p className="mt-5 text-muted-foreground">{t.tagline}</p>
        <div className="mt-5">
          <p className="text-sm font-medium mb-2">Add a session to your plan</p>
          <div className="flex flex-wrap gap-2">
            {SESSIONS.filter(s => t.sessions.includes(s.n)).map(s => {
              const on = inPlan(t.id, s.n);
              return (
                <Button key={s.n} size="sm" variant={on ? "default" : "outline"} onClick={() => toggle(t.id, s.n)} aria-pressed={on}>
                  {on ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}{s.name} · {s.label}
                </Button>
              );
            })}
            <Button size="sm" variant="ghost" onClick={share}><Link2 className="w-4 h-4 mr-1" />Share this track</Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="overview" className="p-6 md:p-8">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="days">Day by day</TabsTrigger>
          <TabsTrigger value="project">Project & tools</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <p className="text-foreground leading-relaxed">{t.overview}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div><h4 className="font-serif font-bold mb-2">Who it&apos;s for</h4><p className="text-muted-foreground text-sm">{t.forWho}</p></div>
            <div><h4 className="font-serif font-bold mb-2">Before starting</h4><p className="text-muted-foreground text-sm">{t.prereq}</p></div>
          </div>
          <div>
            <h4 className="font-serif font-bold mb-3">Students leave able to</h4>
            <ul className="space-y-2">{t.outcomes.map(o => <li key={o} className="flex gap-3 text-sm"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">{o}</span></li>)}</ul>
          </div>
        </TabsContent>
        <TabsContent value="days">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-5" role="tablist" aria-label="Days">
            {t.days.map((d, i) => (
              <button key={i} role="tab" aria-selected={day === i} onClick={() => setDay(i)}
                className={cn("h-11 rounded-md border text-sm font-medium transition-colors", day === i ? "bg-primary text-primary-foreground border-primary" : "hover:border-foreground/40", i === 4 && "sm:mr-0")}>
                {i + 1}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={day} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="rounded-lg border p-5 min-h-[120px]">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">Week {day < 5 ? 1 : 2} · Day {day + 1}</p>
              <h4 className="mt-1 text-xl font-serif font-bold">{t.days[day].title}</h4>
              <p className="mt-2 text-muted-foreground">{t.days[day].detail}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex justify-between">
            <Button size="sm" variant="ghost" disabled={day === 0} onClick={() => setDay(day - 1)}>Previous day</Button>
            <Button size="sm" variant="ghost" disabled={day === t.days.length - 1} onClick={() => setDay(day + 1)}>Next day</Button>
          </div>
          <ol className="mt-6 space-y-1.5 text-sm">
            {t.days.map((d, i) => (
              <li key={i}><button onClick={() => setDay(i)} className={cn("flex gap-3 text-left hover:text-primary", day === i ? "text-primary font-medium" : "text-muted-foreground")}><span className="font-mono w-5">{i + 1}</span>{d.title}</button></li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="project" className="space-y-6">
          <div className="rounded-lg border bg-primary/5 p-5">
            <p className="text-sm font-semibold text-primary inline-flex items-center gap-2"><Trophy className="w-4 h-4" />Final project</p>
            <h4 className="mt-1 text-xl font-serif font-bold">{t.project.name}</h4>
            <p className="mt-2 text-muted-foreground">{t.project.detail}</p>
          </div>
          <div>
            <h4 className="font-serif font-bold mb-3 inline-flex items-center gap-2"><Wrench className="w-4 h-4" />Tools students use</h4>
            <div className="flex flex-wrap gap-2">{t.tools.map(x => <Badge key={x} variant="secondary" className="text-sm font-normal">{x}</Badge>)}</div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

function PlanBuilder({ plan, clashes, onRemove, onClear, planUrl }: { plan: Pick[]; clashes: number[]; onRemove: (p: Pick) => void; onClear: () => void; planUrl: () => string }) {
  const { toast } = useToast();
  const [who, setWho] = useState<"family" | "school">("family");
  const [format, setFormat] = useState("No preference");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lines = plan.map(p => `${trackById(p.track)?.title}: ${SESSIONS.find(s => s.n === p.session)?.name} (${sessionLabel(p.session)})`);
    f.append("access_key", PROGRAM.formKey);
    f.append("subject", `Summer 2027 ${who === "school" ? "school" : "family"} inquiry: ${f.get("name")}`);
    f.append("from_name", "CyruTech Summer 2027 page");
    f.append("inquiry_type", who === "school" ? "School or district" : "Family or student");
    f.append("preferred_format", format);
    f.append("plan", lines.length ? lines.join("\n") : "No tracks picked yet");
    f.append("plan_link", planUrl());
    setSending(true);
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: f });
      const data = await r.json();
      if (!data.success) throw new Error(data.message);
      setSent(true);
      toast({ title: "Sent", description: "Thanks! We'll reply within two business days." });
    } catch {
      toast({ variant: "destructive", title: "Couldn't send", description: `Please try again, or email ${PROGRAM.contactEmail}.` });
    } finally { setSending(false); }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
      <div className="rounded-xl border bg-card p-6 lg:sticky lg:top-36">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold">Your picks</h3>
          {plan.length > 0 && <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>}
        </div>
        {plan.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-50" />
            Nothing yet. Add tracks from <a href="#calendar" className="text-primary underline underline-offset-4">the calendar</a> or any track&apos;s details.
          </div>
        ) : (
          <ol className="space-y-3">
            <AnimatePresence initial={false}>
              {plan.map(p => {
                const t = trackById(p.track)!, I = ICONS[t.icon], clash = clashes.includes(p.session);
                return (
                  <motion.li key={`${p.track}.${p.session}`} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className={cn("flex items-center gap-3 rounded-lg border p-3", clash && "border-amber-500/60 bg-amber-500/5")}>
                    <I className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground">Session {p.session} · {sessionLabel(p.session)}</p>
                    </div>
                    <button onClick={() => onRemove(p)} aria-label={`Remove ${t.title}`} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        )}
        {clashes.length > 0 && (
          <p className="mt-4 text-sm flex gap-2 text-amber-700 dark:text-amber-400"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Two picks share Session {clashes.join(" and ")}. One student can only take one track per session; schools sending groups to both can ignore this.</p>
        )}
        {plan.length > 0 && (
          <div className="mt-5 pt-5 border-t space-y-3">
            <p className="text-sm text-muted-foreground">{plan.length} track{plan.length > 1 ? "s" : ""}, {plan.length * 2} weeks of summer.</p>
            <Button variant="outline" className="w-full" onClick={async () => {
              const url = planUrl();
              try { await navigator.clipboard.writeText(url); toast({ title: "Plan link copied", description: "Anyone who opens it sees this plan." }); }
              catch { window.prompt("Copy this link:", url); }
            }}><Link2 className="w-4 h-4 mr-2" />Copy a link to this plan</Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6 md:p-8">
        {sent ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-4"><Check className="w-7 h-7" /></div>
            <h3 className="text-2xl font-serif font-bold">Thanks, it&apos;s on its way.</h3>
            <p className="mt-2 text-muted-foreground">We&apos;ll reply within two business days with dates, availability and a quote.</p>
            <Button variant="ghost" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <p className="text-sm font-medium mb-2">I&apos;m asking for</p>
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {([["family", Home, "My child or myself"], ["school", School, "A school or district"]] as const).map(([v, Icon, l]) => (
                  <button type="button" key={v} role="radio" aria-checked={who === v} onClick={() => setWho(v)}
                    className={cn("rounded-lg border p-4 text-left text-sm transition-colors", who === v ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-foreground/40")}>
                    <Icon className={cn("w-5 h-5 mb-2", who === v ? "text-primary" : "text-muted-foreground")} />{l}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Your name*</Label><Input id="name" name="name" required autoComplete="name" className="mt-1.5" /></div>
              <div><Label htmlFor="email">Email*</Label><Input id="email" name="email" type="email" required autoComplete="email" className="mt-1.5" /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" className="mt-1.5" /></div>
              {who === "school" ? (
                <div><Label htmlFor="org">School or district*</Label><Input id="org" name="organization" required autoComplete="organization" className="mt-1.5" /></div>
              ) : (
                <div><Label htmlFor="grade">Student&apos;s grade in fall 2027</Label><Input id="grade" name="student_grade" inputMode="numeric" placeholder="e.g. 8" className="mt-1.5" /></div>
              )}
              {who === "school" && <>
                <div><Label htmlFor="students">About how many students?</Label><Input id="students" name="student_count" type="number" min={1} placeholder="e.g. 40" className="mt-1.5" /></div>
                <div><Label htmlFor="role">Your role</Label><Input id="role" name="role" placeholder="e.g. Principal, CS teacher" className="mt-1.5" /></div>
              </>}
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Preferred format</p>
              <div className="flex flex-wrap gap-2">
                {[who === "school" ? "On our campus" : "On campus", "Live online", "No preference"].map(v => (
                  <button type="button" key={v} onClick={() => setFormat(v)} aria-pressed={format === v}
                    className={cn("h-9 px-4 rounded-full border text-sm transition-colors", format === v ? "bg-primary text-primary-foreground border-primary" : "hover:border-foreground/40")}>{v}</button>
                ))}
              </div>
            </div>
            <div><Label htmlFor="message">Anything we should know?</Label><Textarea id="message" name="message" rows={4} className="mt-1.5" placeholder={who === "school" ? "Dates that work for your campus, budget, number of rooms…" : "Experience, interests, questions…"} /></div>
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
            <Button type="submit" size="lg" className="w-full" disabled={sending}><Send className="w-4 h-4 mr-2" />{sending ? "Sending…" : plan.length ? `Send my plan (${plan.length})` : "Send my question"}</Button>
            <p className="text-xs text-muted-foreground text-center">We only use this to reply to you. No mailing lists.</p>
          </form>
        )}
      </div>
    </div>
  );
}
