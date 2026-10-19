import { Mail } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "~/components/ui";
import { MissionVision } from "~/features/about/MissionVision";
import { TeamGrid } from "~/features/about/TeamGrid";
import { ResearchGrid } from "~/features/research/ResearchGrid";
import { TheoryOfChange } from "~/features/research/TheoryOfChange";
import { AboutStory } from "~/features/story/AboutStory";
import { collaboration, hero, statusPanel, statusStrip } from "~/data/home";
import { site } from "~/data/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    description:
      "EntoMetrics Africa is a Nairobi-based research organisation working on Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols.",
  });

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-rule">
      <div className="container-research grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-28">
        <div className="lg:col-span-7">
          <h1 id="hero-heading">{hero.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-70 md:text-xl">{hero.subheadline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={hero.primaryCta.to}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink to={hero.secondaryCta.to} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {/* Static status panel (brief §4.1): no animation. */}
        <div className="lg:col-span-5">
          <div className="card font-mono text-[0.8125rem] sm:text-[0.875rem]">
            <p className="border-b border-rule px-5 py-3 font-medium tracking-[0.06em] text-ink">
              {statusPanel.heading}
            </p>
            <dl className="divide-y divide-rule">
              {statusPanel.lines.map((line) => (
                <div key={line.label} className="flex flex-wrap items-baseline gap-x-2 px-5 py-4">
                  <dt className="inline-flex items-baseline gap-3 text-ink">
                    <span
                      aria-hidden
                      className={`inline-block h-2 w-2 shrink-0 translate-y-[-1px] rounded-full ${line.indicator ? "bg-gold" : "border border-ink-70/50"}`}
                    />
                    {line.label}:
                  </dt>
                  <dd className="pl-5 text-ink-70 sm:pl-0">{line.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusStrip() {
  return (
    <div className="border-b border-rule bg-white">
      <ul className="container-research flex flex-wrap items-center gap-x-4 gap-y-1 py-3 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-70 sm:text-[0.8125rem]">
        {statusStrip.map((item, index) => (
          <li key={item} className="flex items-center gap-4">
            {index > 0 ? <span aria-hidden>·</span> : null}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Collaboration() {
  return (
    <section aria-labelledby="collab-heading" className="section border-t border-rule bg-white">
      <div className="container-research grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label mb-3">Collaboration</p>
          <h2 id="collab-heading">Work with us</h2>
          <p className="mt-5 max-w-3xl text-lg text-ink">{collaboration.text}</p>
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <ButtonAnchor href={`mailto:${site.email}`}>
            <Mail aria-hidden size={18} />
            {collaboration.cta}
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <StatusStrip />
      <AboutStory />
      <MissionVision />
      <ResearchGrid />
      <TheoryOfChange />
      <TeamGrid />
      <Collaboration />
    </>
  );
}
