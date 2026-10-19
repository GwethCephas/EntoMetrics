import { Fan, MessageSquareText, Smartphone, Thermometer, type LucideIcon } from "lucide-react";
import { PageHeader } from "~/components/PageHeader";
import { Reveal } from "~/components/Reveal";
import { StatusTimeline } from "~/components/StatusTimeline";
import { Caption, ReadMore, SectionHeader, StatusBadge } from "~/components/ui";
import { getProgramme } from "~/data/programmes";
import { ILLUSTRATIVE_CAPTION } from "~/data/site";
import { pipeline, TBC, telemetrySpecs } from "~/data/telemetry";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/telemetry";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Our Telemetry Tech",
    description:
      "Low-cost, offline-first substrate temperature probes that send SMS alerts over 2G networks so operators can act on heat build-up. Pilot in preparation.",
  });

const icons: Record<(typeof pipeline)[number]["id"], LucideIcon> = {
  probe: Thermometer,
  gateway: MessageSquareText,
  phone: Smartphone,
  action: Fan,
};

function BlockDiagram() {
  return (
    <figure aria-labelledby="diagram-caption" className="card p-5 md:p-8">
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-stretch md:gap-0">
        {pipeline.map((step, index) => {
          const Icon = icons[step.id];
          return (
            <li key={step.id} className="flex flex-col gap-2 md:flex-1 md:flex-row md:gap-0">
              {index > 0 ? (
                <div aria-hidden className="flex items-center justify-center md:w-10 md:shrink-0">
                  <svg viewBox="0 0 40 24" width="40" height="24" className="rotate-90 md:rotate-0">
                    <line x1="2" y1="12" x2="34" y2="12" stroke="#22A39F" strokeWidth="1.5" strokeDasharray="4 3" />
                    <path d="M30 6l7 6-7 6" fill="none" stroke="#22A39F" strokeWidth="1.5" />
                  </svg>
                </div>
              ) : null}
              <div className="flex-1 rounded-[var(--radius-card)] border border-signal bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] border border-rule text-forest">
                    <Icon aria-hidden size={18} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[0.75rem] text-ink-70">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-3 font-semibold text-forest">{step.label}</p>
                <p className="mt-1 text-[0.875rem] text-ink-70">{step.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption id="diagram-caption" className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[0.875rem] text-ink-70">
          System overview: probe in substrate, 2G SMS gateway, operator phone, action.
        </span>
        <Caption>{ILLUSTRATIVE_CAPTION}</Caption>
      </figcaption>
    </figure>
  );
}

export default function Telemetry() {
  const programme = getProgramme("substrate-telemetry")!;

  return (
    <>
      <PageHeader
        eyebrow="Our Telemetry Tech"
        title="Substrate monitoring that works offline"
        intro={
          <p>
            Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds exceed critical
            temperature thresholds, large numbers of larvae can die unmonitored. We are developing ruggedised,
            offline-first substrate probes for tropical farm conditions.
          </p>
        }
      >
        <div className="mt-8">
          <StatusBadge status={programme.status} tone={programme.badgeTone} />
        </div>
      </PageHeader>

      <section aria-labelledby="how-heading" className="section">
        <div className="container-research">
          <SectionHeader
            eyebrow="How it works"
            title="From probe to action"
            id="how-heading"
            intro={
              <p>
                A probe sits in the substrate bed. Operating over low-bandwidth 2G networks, the system will send an
                automated SMS alert to the facility operator, who can then adjust aeration and ventilation.
              </p>
            }
          />
          <Reveal className="mt-10">
            <BlockDiagram />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="threshold-heading" className="section border-t border-rule">
        <div className="container-research grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Thresholds" title="Provisional values" id="threshold-heading" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="rounded-[var(--radius-card)] border-l-2 border-gold bg-white p-5">
              <p className="text-lg">
                Alert threshold values are <strong>provisional</strong> until they are confirmed against the published
                literature. No threshold on this site should be read as an established finding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="spec-heading" className="section border-t border-rule">
        <div className="container-research">
          <SectionHeader
            eyebrow="Specification"
            title="Hardware specification"
            id="spec-heading"
            intro={<p>Values marked {TBC} have not yet been confirmed and will be added when available.</p>}
          />
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-rule bg-white">
            <table className="w-full min-w-[34rem] border-collapse text-left font-mono text-[0.8125rem] sm:text-[0.875rem]">
              <caption className="sr-only">Telemetry hardware specification</caption>
              <thead>
                <tr className="border-b border-rule bg-paper">
                  <th scope="col" className="px-4 py-3 font-medium uppercase tracking-[0.06em] text-ink-70">
                    Parameter
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium uppercase tracking-[0.06em] text-ink-70">
                    Value
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium uppercase tracking-[0.06em] text-ink-70">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {telemetrySpecs.map((row) => (
                  <tr key={row.parameter} className="border-b border-rule last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-normal text-ink">
                      {row.parameter}
                    </th>
                    <td className={`px-4 py-3 ${row.value === TBC ? "text-ink-70" : "text-ink"}`}>{row.value}</td>
                    <td className="px-4 py-3 text-ink-70">{row.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="status-heading" className="section border-t border-rule">
        <div className="container-research grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Status" title="Pilot in preparation" id="status-heading" />
          </div>
          <div className="space-y-5 md:col-span-7 md:col-start-6">
            <StatusTimeline current={programme.stage} />
            <ReadMore to={`/research/${programme.slug}`}>Programme A: {programme.title}</ReadMore>
          </div>
        </div>
      </section>
    </>
  );
}
