import { Fan, MessageSquareText, Smartphone, Thermometer, type LucideIcon } from "lucide-react";
import { PageHeader } from "~/components/PageHeader";
import { Reveal } from "~/components/Reveal";
import { StatusTimeline } from "~/components/StatusTimeline";
import { ReadMore, SectionHeader, StatusBadge } from "~/components/ui";
import { getProgramme } from "~/data/programmes";
import { pipeline, TBC, telemetrySpecs, type SpecRow } from "~/data/telemetry";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/telemetry";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Our Telemetry Tech",
    description:
      "Ruggedised, offline-first substrate probes in development, designed to send SMS alerts over 2G networks so operators can adjust aeration and ventilation. Pilot in preparation.",
  });

const icons: Record<(typeof pipeline)[number]["id"], LucideIcon> = {
  probe: Thermometer,
  gateway: MessageSquareText,
  phone: Smartphone,
  action: Fan,
};

/** Connector between diagram nodes; draws once via the `.draw-line` CSS in app.css. */
function Connector() {
  return (
    <div aria-hidden className="flex items-center justify-center py-1 md:w-12 md:shrink-0 md:py-0">
      <svg viewBox="0 0 48 16" className="hidden h-4 w-12 md:block" fill="none">
        <path d="M2 8H44" pathLength={1} className="draw-line stroke-signal" strokeWidth="1.5" />
        <path d="M39 3l6 5-6 5" className="stroke-signal" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 16 32" className="h-8 w-4 md:hidden" fill="none">
        <path d="M8 2V28" pathLength={1} className="draw-line stroke-signal" strokeWidth="1.5" />
        <path d="M3 23l5 6 5-6" className="stroke-signal" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function BlockDiagram() {
  return (
    <figure aria-labelledby="diagram-caption">
      <Reveal>
        <ol className="flex flex-col md:flex-row md:items-stretch">
          {pipeline.map((step, index) => {
            const Icon = icons[step.id];
            return (
              <li key={step.id} className="flex flex-col md:flex-1 md:flex-row">
                {index > 0 ? <Connector /> : null}
                <div className="flex flex-1 flex-col rounded-[var(--radius-card)] border border-ink/15 bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-signal text-forest">
                      <Icon aria-hidden size={18} strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[0.75rem] text-ink-70">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-5 font-semibold text-ink">{step.label}</p>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-70">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
      <figcaption id="diagram-caption" className="mt-5 border-t border-rule pt-3 text-[0.875rem] text-ink-70">
        Planned system: probe in substrate, 2G SMS gateway, operator phone, action.
      </figcaption>
    </figure>
  );
}

function SpecGroup({ title, rows }: { title: string; rows: SpecRow[] }) {
  return (
    <tbody>
      <tr>
        <th
          scope="rowgroup"
          colSpan={3}
          className="border-t border-ink/15 bg-paper px-4 pb-2 pt-5 text-left font-sans text-[0.8125rem] font-semibold text-ink"
        >
          {title}
        </th>
      </tr>
      {rows.map((row) => (
        <tr key={row.parameter} className="border-t border-rule">
          <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
            {row.parameter}
          </th>
          <td className={`px-4 py-3 ${row.value === TBC ? "text-ink-70" : "text-ink"}`}>
            {row.value === TBC ? <span className="rounded-[2px] border border-rule px-1.5 py-0.5">{TBC}</span> : row.value}
          </td>
          <td className="px-4 py-3 text-ink-70">{row.note ?? ""}</td>
        </tr>
      ))}
    </tbody>
  );
}

export default function Telemetry() {
  const programme = getProgramme("substrate-telemetry")!;
  const stated = telemetrySpecs.filter((row) => row.value !== TBC);
  const pending = telemetrySpecs.filter((row) => row.value === TBC);

  return (
    <>
      <PageHeader
        eyebrow="Our Telemetry Tech"
        title="Substrate telemetry for tropical farms"
        intro={
          <p>
            Intensive larval rearing generates concentrated metabolic heat. When dense substrate beds exceed critical
            temperature thresholds, large numbers of larvae can die unmonitored. We are developing ruggedised,
            offline-first substrate probes for tropical farm conditions.
          </p>
        }
        aside={
          <div className="border-l border-rule pl-5">
            <p className="label mb-3">Status</p>
            <StatusBadge status={programme.status} tone={programme.badgeTone} />
          </div>
        }
      />

      <section aria-labelledby="how-heading" className="section">
        <div className="container-research">
          <SectionHeader
            index="How it is designed to work"
            title="From probe to action"
            id="how-heading"
            intro={
              <p>
                A probe will sit in the substrate bed. Operating over low-bandwidth 2G networks, the system will send an
                automated SMS alert to the facility operator, who can then adjust aeration and ventilation.
              </p>
            }
          />
          <div className="mt-10">
            <BlockDiagram />
          </div>
        </div>
      </section>

      <section aria-labelledby="threshold-heading" className="section bg-sunken">
        <div className="container-research">
          <SectionHeader
            index="Thresholds"
            title="Provisional values"
            id="threshold-heading"
            intro={
              <p className="border-l-2 border-gold pl-4 text-ink">
                Alert threshold values are <strong className="font-semibold">provisional</strong> until they are
                confirmed against the published literature. No threshold on this site should be read as an established
                finding.
              </p>
            }
          />
        </div>
      </section>

      <section aria-labelledby="spec-heading" className="section">
        <div className="container-research">
          <SectionHeader
            index="Specification"
            title="Planned hardware specification"
            id="spec-heading"
            intro={<p>Values marked {TBC} have not yet been confirmed and will be added when available.</p>}
          />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-rule bg-surface">
            <table className="w-full min-w-[34rem] border-collapse text-left font-mono text-[0.8125rem] sm:text-[0.875rem]">
              <caption className="sr-only">Telemetry hardware specification</caption>
              <thead>
                <tr className="bg-paper">
                  {["Parameter", "Value", "Note"].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-3 font-medium uppercase tracking-[0.06em] text-ink-70">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <SpecGroup title="Stated in the programme description" rows={stated} />
              <SpecGroup title="To be confirmed" rows={pending} />
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="status-heading" className="section bg-sunken">
        <div className="container-research">
          <SectionHeader
            index="Status"
            title="Pilot in preparation"
            id="status-heading"
            intro={<StatusTimeline current={programme.stage} />}
            action={<ReadMore to={`/research/${programme.slug}`}>{`Programme ${programme.code}: ${programme.title}`}</ReadMore>}
          />
        </div>
      </section>
    </>
  );
}
