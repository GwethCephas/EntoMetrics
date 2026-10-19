import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import type { ProgrammeStatus } from "~/data/programmes";

type ButtonVariant = "primary" | "secondary" | "on-dark";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-forest text-paper border border-forest hover:bg-forest-deep hover:border-forest-deep",
  secondary: "border border-forest text-forest bg-transparent hover:bg-forest/5",
  "on-dark": "border border-paper/70 text-paper hover:bg-paper/10",
};

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-card)] px-5 py-3 text-[0.9375rem] font-medium transition-colors";

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

/** Internal route or in-page link styled as a button. */
export function ButtonLink({ to, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${buttonBase} ${buttonStyles[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/** External (mailto:, https:) link styled as a button. */
export function ButtonAnchor({
  href,
  children,
  variant = "primary",
  className = "",
}: Omit<ButtonLinkProps, "to"> & { href: string }) {
  return (
    <a href={href} className={`${buttonBase} ${buttonStyles[variant]} ${className}`}>
      {children}
    </a>
  );
}

export function buttonClassName(variant: ButtonVariant = "primary") {
  return `${buttonBase} ${buttonStyles[variant]}`;
}

interface StatusBadgeProps {
  status: ProgrammeStatus;
  tone: "gold" | "grey";
}

export function StatusBadge({ status, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] border px-2 py-1 font-mono text-[0.71875rem] font-medium uppercase tracking-[0.06em] text-ink ${
        tone === "gold" ? "border-gold bg-gold/10" : "border-rule bg-paper text-ink-70"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${tone === "gold" ? "bg-gold" : "bg-ink-70/60"}`}
      />
      <span>
        <span className="sr-only">Status: </span>
        {status}
      </span>
    </span>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  onDark?: boolean;
}

export function SectionHeader({ eyebrow, title, intro, id, as = "h2", onDark }: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className={`label mb-3 ${onDark ? "!text-paper/80" : ""}`}>{eyebrow}</p>
      ) : null}
      <Heading id={id} className={onDark ? "!text-paper" : undefined}>
        {title}
      </Heading>
      {intro ? (
        <div className={`mt-4 text-lg ${onDark ? "text-paper/85" : "text-ink-70"}`}>{intro}</div>
      ) : null}
    </div>
  );
}

export function ReadMore({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-link inline-flex items-center gap-1.5 text-[0.9375rem] font-medium">
      {children}
      <ArrowRight aria-hidden size={16} />
    </Link>
  );
}

export function Caption({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={`font-mono text-[0.75rem] ${onDark ? "text-paper/80" : "text-ink-70"}`}>{children}</p>
  );
}
