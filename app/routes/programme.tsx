import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { data, Link } from "react-router";
import { RichText } from "~/components/RichText";
import { StatusTimeline } from "~/components/StatusTimeline";
import { StatusBadge } from "~/components/ui";
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

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-rule py-10 md:grid-cols-12 md:gap-8">
      <h2 id={id} className="text-[1.375rem] md:col-span-4 md:text-[1.5rem]">
        {title}
      </h2>
      <div className="space-y-4 md:col-span-8">{children}</div>
    </section>
  );
}

export default function ProgrammePage({ loaderData }: Route.ComponentProps) {
  const { programme } = loaderData;
  const others = programmes.filter((p) => p.slug !== programme.slug);

  return (
    <article>
      <div className="border-b border-rule">
        <div className="container-research pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link to="/research" className="text-link inline-flex items-center gap-1.5 text-[0.9375rem]">
              <ArrowLeft aria-hidden size={16} />
              Research Hub
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.75rem] text-ink-70">Programme {programme.code}</span>
            <StatusBadge status={programme.status} tone={programme.badgeTone} />
          </div>
          <h1 className="mt-5 max-w-4xl">{programme.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-ink-70">{programme.summary}</p>
        </div>
      </div>

      <div className="container-research pb-16 md:pb-24">
        <Section id="question" title="Question">
          {programme.question.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
        </Section>

        <Section id="method" title="Method">
          {programme.method.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
          <p className="text-[0.9375rem] italic text-ink-70">{protocolsNote}</p>
        </Section>

        <Section id="status" title="Status">
          <p>
            Current status: <span className="font-mono text-[0.9375rem]">{programme.status}</span>
          </p>
          <StatusTimeline current={programme.stage} />
          {programme.protocolLinks.length > 0 ? (
            <ul className="space-y-1">
              {programme.protocolLinks.map((link) => (
                <li key={link.url}>
                  <a className="text-link" href={link.url} rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.9375rem] text-ink-70">No protocols have been published yet.</p>
          )}
        </Section>

        <Section id="outputs" title="Planned outputs">
          <ul className="list-none space-y-2">
            {programme.plannedOutputs.map((output) => (
              <li key={output} className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-forest" />
                <span>
                  <RichText text={output} />
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <nav aria-label="Other programmes" className="border-t border-rule pt-10">
          <p className="label mb-4">Other programmes</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link to={`/research/${p.slug}`} className="card card-interactive block p-5">
                  <span className="font-mono text-[0.75rem] text-ink-70">Programme {p.code}</span>
                  <span className="mt-1 block font-semibold text-forest">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
