import { Mail, MapPin } from "lucide-react";
import { LinkedInIcon } from "~/components/icons";
import { PageHeader } from "~/components/PageHeader";
import { collaboration } from "~/data/home";
import { site } from "~/data/site";
import { ContactForm } from "~/features/contact/ContactForm";
import { handleContactSubmission, isEmailConfigured } from "~/features/contact/submit.server";
import { cloudflareContext } from "~/lib/cloudflare";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Contact",
    description:
      "Collaboration enquiries for EntoMetrics Africa from entomologists, invertebrate welfare scientists, hardware engineers and agricultural research groups.",
  });

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflareContext);
  return { emailConfigured: isEmailConfigured(env) };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = context.get(cloudflareContext);
  const formData = await request.formData();
  return handleContactSubmission(formData, {
    env,
    remoteIp: request.headers.get("CF-Connecting-IP"),
  });
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Collaboration enquiries" intro={<p>{collaboration.text}</p>} />

      <section aria-label="Contact form and details" className="section">
        <div className="container-research grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="mb-8 text-[clamp(1.375rem,1.2rem+0.7vw,1.625rem)]">Send an enquiry</h2>
            <ContactForm emailConfigured={loaderData.emailConfigured} />
          </div>

          <aside aria-labelledby="details-heading" className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink/15 pt-6 lg:sticky lg:top-28">
              <h2 id="details-heading" className="text-[1.25rem]">
                Details
              </h2>
              <dl className="mt-6 divide-y divide-rule text-[0.9375rem] [&>div]:py-4 [&>div:first-child]:pt-0">
                <div>
                  <dt className="label flex items-center gap-2">
                    <Mail aria-hidden size={14} /> Email
                  </dt>
                  <dd className="mt-1">
                    <a className="text-link font-mono text-[0.875rem]" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                    {!site.emailVerified ? (
                      <span className="mt-1 block text-[0.8125rem] text-ink-70">
                        Proposed address; delivery not yet confirmed.
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt className="label flex items-center gap-2">
                    <MapPin aria-hidden size={14} /> Location
                  </dt>
                  <dd className="mt-1">{site.location}</dd>
                </div>
                <div>
                  <dt className="label flex items-center gap-2">
                    <LinkedInIcon width={13} height={13} /> LinkedIn
                  </dt>
                  <dd className="mt-1">
                    <a className="text-link" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                      EntoMetrics Africa on LinkedIn
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
