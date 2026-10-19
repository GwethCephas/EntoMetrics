import { DraftNotice } from "~/components/DraftNotice";
import { PageHeader } from "~/components/PageHeader";
import { RichText } from "~/components/RichText";
import { site } from "~/data/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/privacy";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Privacy Policy",
    description: "How the EntoMetrics Africa website handles personal information. Draft, to be reviewed.",
  });

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      `This website is operated by ${site.name}, ${site.location}.`,
      "[PLACEHOLDER — CONFIRM WITH CLIENT: registered legal name, registration number and postal address of the data controller]",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "If you use the contact form, we collect the details you choose to give us: your name, organisation, email address, collaboration type and message.",
      "We do not use advertising trackers. The site does not set cookies of its own.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use contact-form details only to read and reply to your enquiry. We do not sell or share them for marketing.",
      "Messages are delivered to our inbox through an email delivery provider. [PLACEHOLDER — CONFIRM WITH CLIENT: name of the email provider and where it processes data]",
    ],
  },
  {
    heading: "Analytics",
    body: [
      "If analytics are enabled, we use a privacy-friendly, cookie-free service that reports aggregate page views without identifying individual visitors. [PLACEHOLDER — CONFIRM WITH CLIENT: analytics provider, if any]",
    ],
  },
  {
    heading: "Retention",
    body: ["[PLACEHOLDER — CONFIRM WITH CLIENT: how long enquiry emails are kept]"],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us what personal information we hold about you, and ask us to correct or delete it.",
      "[LEGAL REVIEW: confirm applicable data-protection obligations and any regulator contact details]",
    ],
  },
  {
    heading: "Contact",
    body: [`For privacy questions, email ${site.email}.`],
  },
];

export default function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Policy" title="Privacy Policy">
        <DraftNotice />
      </PageHeader>
      <div className="container-research section !pt-12">
        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[1.375rem]">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>
          ))}
          <p className="font-mono text-[0.8125rem] text-ink-70">Last updated: [PLACEHOLDER — date of approval]</p>
        </div>
      </div>
    </>
  );
}
