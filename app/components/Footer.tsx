import { Link } from "react-router";
import { legalNav, primaryNav } from "~/data/nav";
import { site } from "~/data/site";
import { LinkedInIcon } from "./icons";
import { Logo } from "./Logo";
import { RichText } from "./RichText";

// No reversed (white) logo has been supplied, so the footer stays light.
export function Footer() {
  return (
    <footer className="border-t border-rule bg-white">
      <div className="container-research grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Logo height={48} className="inline-block rounded-sm" />
          <p className="mt-5 max-w-sm text-[0.9375rem] text-ink-70">
            Independent research on Black Soldier Fly welfare, micro-climate telemetry and humane
            rearing protocols. {site.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-3">Site</p>
          <ul className="space-y-2 text-[0.9375rem]">
            <li>
              <Link to="/" className="text-link">
                Home
              </Link>
            </li>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label mb-3">Organisation</p>
          <ul className="space-y-2 text-[0.9375rem]">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.linkedin} className="text-link inline-flex items-center gap-2" rel="noopener noreferrer" target="_blank">
                <LinkedInIcon width={15} height={15} />
                LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-link font-mono text-[0.875rem]">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="container-research flex flex-col gap-2 py-6 font-mono text-[0.75rem] text-ink-70 md:flex-row md:items-center md:justify-between">
          <p>
            <RichText text={site.registrationLine} />
          </p>
          <p>{site.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
