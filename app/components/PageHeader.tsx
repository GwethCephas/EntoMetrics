import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  /** Content shown beside the intro on wide screens (metadata, status). */
  aside?: ReactNode;
  children?: ReactNode;
  /** Wider title measure for long headlines. */
  wide?: boolean;
}

/** Title block for interior pages. */
export function PageHeader({ eyebrow, title, intro, aside, children, wide }: PageHeaderProps) {
  return (
    <div className="border-b border-rule">
      <div className="container-research pb-12 pt-12 md:pb-16 md:pt-20">
        <p className="flex items-center gap-3 font-mono text-label uppercase text-ink-70">
          <span aria-hidden className="h-px w-8 bg-gold" />
          {eyebrow}
        </p>
        <h1 className={`mt-5 ${wide ? "max-w-[24ch]" : "max-w-[18ch]"}`}>{title}</h1>
        {intro || aside ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {intro ? <div className="measure text-lead text-ink-70 lg:col-span-7">{intro}</div> : null}
            {aside ? <div className="lg:col-span-4 lg:col-start-9">{aside}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
