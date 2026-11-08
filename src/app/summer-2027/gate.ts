// Summer 2027 is gated: the public build shows only "Coming soon", and the full page (./full.tsx and
// ./program.ts) is left out of it entirely. The full page shows in `npm run dev`, or in a build made
// with SUMMER_2027=live (add it to the build step's env in .github/workflows/nextjs.yml to launch).
// page.tsx repeats this test inline: the bundler only drops the full page when the test is written in place.
export const SUMMER_LIVE = process.env.NODE_ENV === "development" || process.env.SUMMER_2027 === "live";
