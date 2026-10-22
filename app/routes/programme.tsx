import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { data, Link } from "react-router";
import { StatusTimeline } from "~/components/StatusTimeline";
import { ProgrammeCode, StatusBadge } from "~/components/ui";
import { protocolsNote } from "~/data/home";
import { getProgramme, programmes } from "~/data/programmes";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/programme";

export function loader({ params }: Route.LoaderArgs) {
  const programme = getProgramme(params.slug);
  if (!programme) throw data(null, { status: 404 });
  return { programme };
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData
    ? pageMeta({
        title: loaderData.programme.title,
        description: loaderData.programme.summary.slice(0, 155).replace(/\s+\S*$/, "") + "…",
      })
    : pageMeta({ title: "Programme not found", description: "This research programme could not be found." });

function BodySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink/15 pt-6">
      <h2 id={id} className="text-[clamp(1.375rem,1.2rem+0.7vw,1.625rem)]">
        {title}
      </h2>
      <div className="prose-research mt-4">{children}</div>
    </section>
  );
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-rule py-4 first:border-t-0 first:pt-0">
      <dt className="label mb-2">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ProgrammePage({ loaderData }: Route.ComponentProps) {
  const { programme } = loaderData;
  const others = programmes.filter((p) => p.slug !== programme.slug);

  return (
    <article>
      <div className="border-b border-rule">
        <div className="container-research pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb">
            <Link
              to="/research"
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-ink-70 transition-colors hover:text-forest"
            >
              <ArrowLeft aria-hidden size={16} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
              Research Hub
            </Link>
          </nav>
          <div className="mt-10 flex items-center gap-4">
            <ProgrammeCode code={programme.code} size="lg" />
            <span className="font-mono text-label uppercase text-ink-70">Programme {programme.code}</span>
          </div>
          <h1 className="mt-6 max-w-[22ch]">{programme.title}</h1>
          <p className="measure mt-6 text-lead text-ink-70">{programme.teaser}</p>
        </div>
      </div>

      <div className="container-research grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-12 lg:col-span-7">
          <section aria-labelledby="question" className="border-l-2 border-forest pl-5 md:pl-7">
            <h2 id="question" className="label !text-forest">
              Research question
            </h2>
            <div className="mt-4 space-y-4">
              {programme.question.map((text, index) => (
                <p
                  key={text}
                  className={
                    index === 0
                      ? "text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-medium leading-snug tracking-[-0.01em] text-ink"
                      : "text-ink-70"
                  }
                >
                  {text}
                </p>
              ))}
            </div>
          </section>

          <BodySection id="method" title="Method">
            {programme.method.map((text) => (
              <p key={text}>
                {text}
              </p>
            ))}
            <p className="text-[0.9375rem] italic text-ink-70">{protocolsNote}</p>
          </BodySection>

          {programme.plannedOutputs.length > 0 ? (
            <BodySection id="outputs" title="Planned outputs">
              <ul className="space-y-2">
                {programme.plannedOutputs.map((output) => (
                  <li key={output} className="flex gap-3">
                    <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-forest" />
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </BodySection>
          ) : null}
        </div>

        <aside aria-labelledby="status" className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-[var(--radius-card)] border border-rule bg-surface p-5 lg:sticky lg:top-28">
            <h2 id="status" className="sr-only">
              Status
            </h2>
            <dl>
              <MetaRow label="Status">
                <StatusBadge status={programme.status} tone={programme.badgeTone} />
              </MetaRow>
              <MetaRow label="Stage">
                <StatusTimeline current={programme.stage} orientation="vertical" />
              </MetaRow>
              <MetaRow label="Protocols">
                {programme.protocolLinks.length > 0 ? (
                  <ul className="space-y-1">
                    {programme.protocolLinks.map((link) => (
                      <li key={link.url}>
                        <a className="text-link text-[0.9375rem]" href={link.url} rel="noopener noreferrer">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[0.9375rem] text-ink-70">No protocols have been published yet.</p>
                )}
              </MetaRow>
            </dl>
          </div>
        </aside>
      </div>

      <nav aria-label="Other programmes" className="border-t border-rule bg-sunken">
        <div className="container-research py-10 md:py-12">
          <p className="label mb-5">Other programmes</p>
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-rule bg-rule md:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/research/${p.slug}`}
                  className="group flex h-full items-center gap-4 bg-surface p-5 transition-colors duration-150 hover:bg-paper"
                >
                  <ProgrammeCode code={p.code} />
                  <span className="flex-1 font-medium text-forest">{p.title}</span>
                  <ArrowRight aria-hidden size={18} className="nudge shrink-0 text-forest" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </article>
  );
}
