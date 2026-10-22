import { PolicyPage, type PolicySection } from "~/components/PolicyPage";
import { RichText } from "~/components/RichText";
import { site } from "~/data/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/privacy";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Privacy Policy",
    description: "How the EntoMetrics Africa website handles personal information. Draft, to be reviewed.",
  });

const sections: PolicySection[] = [
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
      "Contact-form messages are processed by Formspree (formspree.io), a form-handling service, which forwards them to our inbox. [LEGAL REVIEW: confirm Formspree’s data-processing terms and where it stores submissions]",
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
    <PolicyPage
      title="Privacy Policy"
      sections={sections}
      footer={
        <p className="font-mono text-[0.8125rem] text-ink-70">
          Last updated: <RichText text="[PLACEHOLDER — date of approval]" />
        </p>
      }
    />
  );
}
