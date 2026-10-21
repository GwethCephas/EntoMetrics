import type { ReactNode } from "react";
import { DraftNotice } from "./DraftNotice";
import { PageHeader } from "./PageHeader";
import { RichText } from "./RichText";

export interface PolicySection {
  heading: string;
  body: string[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Long-form policy layout: draft flag, on-page index (desktop), readable prose column. */
export function PolicyPage({
  title,
  sections,
  footer,
}: {
  title: string;
  sections: PolicySection[];
  footer?: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow="Policy" title={title}>
        <DraftNotice />
      </PageHeader>
      <div className="container-research grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-8">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <p className="label mb-4">On this page</p>
            <ol className="space-y-2 border-l border-rule text-[0.875rem]">
              {sections.map((section) => (
                <li key={section.heading}>
                  <a
                    href={`#${slugify(section.heading)}`}
                    className="-ml-px block border-l border-transparent pl-4 text-ink-70 transition-colors duration-150 hover:border-forest hover:text-forest focus-visible:border-forest"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="prose-research lg:col-span-8 lg:col-start-5">
          {sections.map((section) => (
            <section key={section.heading} aria-labelledby={slugify(section.heading)}>
              <h2 id={slugify(section.heading)}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>
          ))}
          {footer}
        </div>
      </div>
    </>
  );
}
