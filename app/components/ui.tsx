import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import type { ProgrammeStatus } from "~/data/programmes";

type ButtonVariant = "primary" | "secondary" | "on-dark";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-forest text-paper border border-forest hover:bg-forest-deep hover:border-forest-deep",
  secondary: "border border-forest/70 text-forest bg-transparent hover:border-forest hover:bg-forest/[0.06]",
  "on-dark": "border border-paper/60 text-paper hover:border-paper hover:bg-paper/10",
};

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-card)] px-5 py-3 text-[0.9375rem] font-medium transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-research)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

export function buttonClassName(variant: ButtonVariant = "primary") {
  return `${buttonBase} ${buttonStyles[variant]}`;
}

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
}

/** Internal route or in-page link styled as a button. */
export function ButtonLink({ to, children, variant = "primary", className = "", arrow }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${buttonClassName(variant)} ${className}`}>
      {children}
      {arrow ? <ArrowRight aria-hidden size={16} className="nudge" /> : null}
    </Link>
  );
}

/** External (mailto:, https:) link styled as a button. */
export function ButtonAnchor({
  href,
  children,
  variant = "primary",
  className = "",
}: Omit<ButtonLinkProps, "to" | "arrow"> & { href: string }) {
  return (
    <a href={href} className={`${buttonClassName(variant)} ${className}`}>
      {children}
    </a>
  );
}

interface StatusBadgeProps {
  status: ProgrammeStatus;
  tone: "gold" | "grey";
}

/** Programme status. The label text carries the meaning; the dot is decorative. */
export function StatusBadge({ status, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] border px-2 py-[3px] font-mono text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.06em] ${
        tone === "gold" ? "border-gold/70 bg-gold/[0.08] text-ink" : "border-rule bg-surface text-ink-70"
      }`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone === "gold" ? "bg-gold" : "bg-ink-70/50"}`} />
      <span>
        <span className="sr-only">Status: </span>
        {status}
      </span>
    </span>
  );
}

interface SectionHeaderProps {
  title: string;
  id?: string;
  /** Short mono index or metadata shown above the title, e.g. "01". */
  index?: string;
  intro?: ReactNode;
  /** Optional link or action shown with the intro. */
  action?: ReactNode;
  as?: "h1" | "h2";
  onDark?: boolean;
  /** "split": title left, intro right (default). "stack": title above intro. */
  layout?: "split" | "stack";
  className?: string;
}

/**
 * Editorial section opener: a hairline rule, an optional mono index, the
 * title, and an intro set in its own column.
 */
export function SectionHeader({
  title,
  id,
  index,
  intro,
  action,
  as = "h2",
  onDark,
  layout = "split",
  className = "",
}: SectionHeaderProps) {
  const Heading = as;
  const split = layout === "split" && (intro || action);
  return (
    <div
      className={`border-t pt-5 md:pt-6 ${onDark ? "border-paper/25" : "border-ink/15"} ${
        split ? "grid gap-4 md:grid-cols-12 md:gap-8" : ""
      } ${className}`}
    >
      <div className={split ? "md:col-span-5" : ""}>
        {index ? (
          <p className={`mb-3 font-mono text-label uppercase ${onDark ? "text-paper/75" : "text-ink-70"}`}>{index}</p>
        ) : null}
        <Heading id={id} className={onDark ? "!text-paper" : undefined}>
          {title}
        </Heading>
      </div>
      {intro || action ? (
        <div className={split ? "md:col-span-6 md:col-start-7 md:pt-7" : "mt-4"}>
          {intro ? (
            <div className={`measure text-lead ${onDark ? "text-paper/85" : "text-ink-70"}`}>{intro}</div>
          ) : null}
          {action ? <div className={intro ? "mt-5" : ""}>{action}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

export function ReadMore({ to, children, onDark }: { to: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-gold focus-visible:decoration-gold ${
        onDark ? "text-paper decoration-paper/40" : "text-forest decoration-forest/35"
      }`}
    >
      {children}
      <ArrowRight aria-hidden size={16} className="nudge shrink-0" />
    </Link>
  );
}

export function Caption({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return <p className={`font-mono text-[0.75rem] ${onDark ? "text-paper/80" : "text-ink-70"}`}>{children}</p>;
}

/** Mono code marker used to identify research programmes (A, B, C). */
export function ProgrammeCode({ code, size = "sm" }: { code: string; size?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-forest/40 font-mono font-medium text-forest ${
        size === "lg" ? "h-12 w-12 text-lg" : "h-8 w-8 text-[0.8125rem]"
      }`}
    >
      {code}
    </span>
  );
}
