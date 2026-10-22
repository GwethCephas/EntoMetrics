import type { ReactNode } from "react";
import { Link } from "react-router";
import { legalNav, primaryNav } from "~/data/nav";
import { programmes } from "~/data/programmes";
import { site } from "~/data/site";
import { InstagramIcon, LinkedInIcon } from "./icons";
import { Logo } from "./Logo";

const footerLink =
  "text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-forest hover:decoration-gold focus-visible:decoration-gold";

function Column({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="label mb-4">{title}</p>
      <ul className="space-y-2.5 text-[0.9375rem]">{children}</ul>
    </div>
  );
}

// No reversed (white) logo has been supplied, so the footer stays light.
export function Footer() {
  return (
    <footer className="border-t border-rule bg-surface">
      <div className="container-research grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo height={48} className="inline-block rounded-sm" />
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ink-70">
            Black Soldier Fly welfare science, micro-climate telemetry and humane rearing protocols.
          </p>
          <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-70">{site.location}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:col-start-6">
          <Column title="Site">
            <li>
              <Link to="/" className={footerLink}>
                Home
              </Link>
            </li>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Organisation">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.linkedin} className={`${footerLink} inline-flex items-center gap-2`} rel="noopener noreferrer" target="_blank">
                <LinkedInIcon width={14} height={14} className="text-forest" />
                LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} className={`${footerLink} inline-flex items-center gap-2`} rel="noopener noreferrer" target="_blank">
                <InstagramIcon width={14} height={14} className="text-forest" />
                Instagram
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${footerLink} [overflow-wrap:anywhere]`}>
                {site.email}
              </a>
            </li>
          </Column>
          <Column title="Research" className="col-span-2 sm:col-span-1">
            {programmes.map((programme) => (
              <li key={programme.slug}>
                <Link to={`/research/${programme.slug}`} className={`${footerLink} inline-flex gap-2`}>
                  <span className="font-mono text-ink-70" aria-hidden>
                    {programme.code}
                  </span>
                  <span>
                    <span className="sr-only">Programme {programme.code}: </span>
                    {programme.title}
                  </span>
                </Link>
              </li>
            ))}
          </Column>

        </nav>
      </div>

      <div className="border-t border-rule">
        <div className="container-research flex flex-col gap-2 py-5 font-mono text-[0.75rem] text-ink-70 md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
