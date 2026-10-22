import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router";
import { LinkedInIcon } from "~/components/icons";
import { Reveal } from "~/components/Reveal";
import { ButtonAnchor, ButtonLink, ProgrammeCode, ReadMore, SectionHeader, StatusBadge } from "~/components/ui";
import { AboutStory } from "~/features/story/AboutStory";
import { collaboration, hero, homeLinks, mission, protocolsNote, statusPanel, statusStrip, vision } from "~/data/home";
import { programmes } from "~/data/programmes";
import { site } from "~/data/site";
import { theoryOfChange } from "~/data/theoryOfChange";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    description:
      "EntoMetrics Africa is a Nairobi-based research organisation working on Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols.",
  });

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b border-rule">
      <div className="container-research grid gap-12 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-24 lg:pt-28">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 font-mono text-label uppercase text-ink-70">
            <span aria-hidden className="h-px w-8 bg-gold" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="mt-6 max-w-[15ch] text-[clamp(2.5rem,1.6rem+3.6vw,4.25rem)]">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-70">{hero.supporting}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={hero.primaryCta.to} arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink to={hero.secondaryCta.to} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {/* Static status panel (brief §4.1): no animation. */}
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius-card)] border border-ink/15 bg-surface font-mono text-[0.8125rem] shadow-[0_1px_0_rgba(26,37,44,0.04)] sm:text-[0.875rem]">
            <p className="border-b border-rule px-5 py-3 font-medium tracking-[0.06em] text-ink">{statusPanel.heading}</p>
            <dl className="divide-y divide-rule">
              {statusPanel.lines.map((line) => (
                <div key={line.label} className="relative flex flex-wrap items-baseline gap-x-2 py-4 pl-10 pr-5">
                  <dt className="text-ink">
                    <span
                      aria-hidden
                      className={`absolute left-5 top-[1.55rem] h-2 w-2 rounded-full ${line.indicator ? "bg-gold" : "border border-ink-70/50"}`}
                    />
                    {line.label}:
                  </dt>
                  <dd className="text-ink-70">{line.value}</dd>
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
    <div className="border-b border-rule bg-surface">
      <ul className="container-research flex flex-wrap items-center gap-x-5 gap-y-1 py-3.5 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-70 sm:text-[0.8125rem]">
        {statusStrip.map((item, index) => (
          <li key={item} className="flex items-center gap-5">
            {index > 0 ? <span aria-hidden className="hidden h-3 w-px bg-rule-strong/60 sm:block" /> : null}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissionVisionPreview() {
  return (
    <section aria-labelledby="mission-heading" className="section">
      <div className="container-research">
        <h2 id="mission-heading" className="sr-only">
          Mission and vision
        </h2>
        <div className="grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-2 md:gap-12">
          {[mission, vision].map((item) => (
            <div key={item.heading}>
              <p className="label">{item.heading}</p>
              <p className="mt-4 max-w-[34ch] text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-medium leading-snug tracking-[-0.015em] text-ink">
                {item.preview}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ReadMore to={homeLinks.missionVision.to}>{homeLinks.missionVision.label}</ReadMore>
        </div>
      </div>
    </section>
  );
}

function ResearchPreview() {
  return (
    <section id="programmes" aria-labelledby="programmes-heading" className="section bg-sunken">
      <div className="container-research">
        <SectionHeader
          index="Research Hub"
          title="Research programmes"
          id="programmes-heading"
          action={<ReadMore to={homeLinks.research.to}>{homeLinks.research.label}</ReadMore>}
        />
        <ol className="mt-10 border-b border-ink/15">
          {programmes.map((programme) => (
            <li key={programme.slug} className="border-t border-ink/15">
              <Link
                to={`/research/${programme.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-3 py-6 transition-colors duration-150 hover:bg-surface/60 sm:gap-x-6 md:grid-cols-[auto_minmax(0,5fr)_minmax(0,4fr)_auto] md:items-center md:px-2"
              >
                <ProgrammeCode code={programme.code} />
                <div className="min-w-0">
                  <h3 className="text-forest transition-colors group-hover:text-forest-deep">{programme.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-70 md:hidden">{programme.teaser}</p>
                </div>
                <p className="hidden text-[0.9375rem] leading-relaxed text-ink-70 md:block">{programme.teaser}</p>
                <ArrowRight aria-hidden size={18} className="nudge mt-1 text-forest md:mt-0" />
                <div className="col-start-2 md:-mt-1">
                  <StatusBadge status={programme.status} tone={programme.badgeTone} />
                </div>
              </Link>
            </li>
          ))}
        </ol>
        <p className="measure mt-6 text-[0.9375rem] italic text-ink-70">{protocolsNote}</p>
      </div>
    </section>
  );
}

function TheoryOfChangePreview() {
  return (
    <section aria-labelledby="toc-heading" className="section">
      <div className="container-research">
        <SectionHeader
          index="Programme logic"
          title="Theory of Change"
          id="toc-heading"
          action={<ReadMore to={homeLinks.theoryOfChange.to}>{homeLinks.theoryOfChange.label}</ReadMore>}
        />
        <Reveal>
          <ol className="mt-10 grid gap-0 md:grid-cols-5">
            {theoryOfChange.map((stage, index) => (
              <li key={stage.title} className="relative flex gap-4 pb-6 last:pb-0 md:flex-col md:gap-3 md:pb-0 md:pr-4">
                {index < theoryOfChange.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-8 bottom-0 w-px bg-forest/30 md:left-8 md:right-0 md:top-[15px] md:bottom-auto md:h-px md:w-auto"
                  />
                ) : null}
                <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-forest bg-paper font-mono text-[0.75rem] text-forest">
                  {index + 1}
                </span>
                <span className="pt-1 font-medium text-ink md:pt-0">{stage.title}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function Collaboration() {
  return (
    <section aria-labelledby="collab-heading" className="section bg-sunken">
      <div className="container-research">
        <div className="grid gap-10 border-t border-ink/15 pt-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">Collaboration</p>
          <h2 id="collab-heading" className="mt-3">
            Work with us
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] leading-snug tracking-[-0.01em] text-ink">
            {collaboration.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonAnchor href={`mailto:${site.email}`}>
              <Mail aria-hidden size={18} />
              {collaboration.cta}
            </ButtonAnchor>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex items-center gap-2 text-[0.9375rem]"
            >
              <LinkedInIcon width={15} height={15} />
              Follow on LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
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
      <MissionVisionPreview />
      <ResearchPreview />
      <TheoryOfChangePreview />
      <Collaboration />
    </>
  );
}
