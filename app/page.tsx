import type { Metadata } from "next";
import AuthCard from "@/components/learningdude/AuthCard";
import BrandLogo from "@/components/learningdude/BrandLogo";
import HeroScene from "@/components/learningdude/HeroScene";

export const metadata: Metadata = {
  title: "LearningDude AI – Your Career Guide",
  description: "Build your skills. Create your future.",
};

export default function Page() {
  return (
    <main className="ld-page">
      <section className="ld-hero" aria-labelledby="ld-headline">
        <header className="ld-brand">
          <BrandLogo size={44} />
          <span className="ld-brand-name">
            LearningDude <b>AI</b>
          </span>
        </header>

        <div className="ld-copy">
          <h1 id="ld-headline">
            Confused about your <span>tech career?</span>
          </h1>
          <p>Too many choices. No clear direction. Let&apos;s figure out your future together.</p>
        </div>

        <div className="ld-stage">
          <HeroScene />
        </div>

        <footer className="ld-tagline">Build your skills. Create your future.</footer>
      </section>

      <aside className="ld-auth" aria-label="Sign in or create an account">
        <AuthCard />
      </aside>
    </main>
  );
}