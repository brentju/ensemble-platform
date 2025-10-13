import Hero from "./components/Hero";
import ScrollEffects from "./components/ScrollEffects";
import SolutionGrid from "./components/SolutionGrid";
import HowItWorks from "./components/HowItWorks";
import HorizontalFeatures from "./components/HorizontalFeatures";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {
  return (
    <div id="main">
      <ScrollEffects />
      {/* Hero */}
      <Hero />

      {/* Problem / Solution */}
      <section data-animate="reveal" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl">The Problem</h2>
          <ul className="mt-6 space-y-2 text-slate-700">
            <li>Today, product testing is slow, expensive, and siloed.</li>
            <li>Recruiting users costs tens of thousands of dollars and takes weeks to assemble panels.</li>
          </ul>
        </div>

        <div className="mt-12">
          <h3 className="font-serif text-2xl md:text-3xl">Our solution highlights</h3>
          <SolutionGrid />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <HorizontalFeatures />

      {/* Use Cases */}
      <section id="use-cases" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <h2 className="font-serif text-3xl md:text-4xl">Use cases</h2>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Product teams validating UX flows",
              desc: "Simulate real journeys to validate critical paths before launch.",
            },
            {
              title: "QA teams catching edge cases",
              desc: "Agent swarms expose regressions and hard-to-reach scenarios.",
            },
            {
              title: "Indie hackers getting instant feedback",
              desc: "Ship faster with continuous, targeted product insights.",
            },
          ].map((uc) => (
            <div
              key={uc.title}
              data-animate="reveal"
              className="glass rounded-2xl p-6 bg-white/30"
            >
              <h3 className="text-slate-800 font-medium">{uc.title}</h3>
              <p className="mt-2 text-slate-700">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" data-animate="reveal" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <h2 className="font-serif text-3xl md:text-4xl">Join the waitlist</h2>
        <p className="mt-4 text-slate-700 max-w-2xl">Be first to explore the platform as we open access.</p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}
