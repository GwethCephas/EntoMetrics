import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Title block for interior pages. */
export function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <div className="border-b border-rule">
      <div className="container-research pb-12 pt-14 md:pb-16 md:pt-20">
        <p className="label mb-4">{eyebrow}</p>
        <h1 className="max-w-4xl">{title}</h1>
        {intro ? <div className="mt-5 max-w-3xl text-lg text-ink-70 md:text-xl">{intro}</div> : null}
        {children}
      </div>
    </div>
  );
}
