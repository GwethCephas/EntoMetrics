import type { ServerEnv } from "~/lib/cloudflare";
import { contactSchema, HONEYPOT_FIELD, type ContactField, type ContactMessage } from "./schema";

/**
 * Result of a contact-form submission. "sent" is returned only after the
 * email provider has accepted the message. Without configuration the result
 * is "not-sent": the UI must never imply delivery in that case.
 */
export type ContactResult =
  | { status: "sent" }
  | { status: "not-sent"; reason: "not-configured" }
  | { status: "invalid"; fieldErrors: Partial<Record<ContactField, string>> }
  | { status: "rejected" }
  | { status: "error" };

interface SubmitOptions {
  env: ServerEnv;
  fetch?: typeof fetch;
  remoteIp?: string | null;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TURNSTILE_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isEmailConfigured(env: ServerEnv) {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL);
}

export async function handleContactSubmission(
  formData: FormData,
  { env, fetch: fetchImpl = fetch, remoteIp = null }: SubmitOptions,
): Promise<ContactResult> {
  // Honeypot: a filled hidden field means an automated submission.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "rejected" };
  }

  const parsed = contactSchema.safeParse({
    name: stringField(formData, "name"),
    organisation: stringField(formData, "organisation"),
    email: stringField(formData, "email"),
    collaborationType: stringField(formData, "collaborationType"),
    message: stringField(formData, "message"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = stringField(formData, "cf-turnstile-response");
    const passed = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, remoteIp, fetchImpl);
    if (!passed) return { status: "rejected" };
  }

  if (!isEmailConfigured(env)) {
    return { status: "not-sent", reason: "not-configured" };
  }

  try {
    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildEmail(parsed.data, env)),
    });
    if (!response.ok) {
      console.error("Contact email rejected by provider", response.status);
      return { status: "error" };
    }
    return { status: "sent" };
  } catch (error) {
    console.error("Contact email request failed", error instanceof Error ? error.message : "unknown");
    return { status: "error" };
  }
}

export function buildEmail(message: ContactMessage, env: ServerEnv) {
  const subject = `Website enquiry: ${message.collaborationType} from ${message.name}`;
  const text = [
    `Name: ${message.name}`,
    `Organisation: ${message.organisation || "(not given)"}`,
    `Email: ${message.email}`,
    `Collaboration type: ${message.collaborationType}`,
    "",
    message.message,
  ].join("\n");
  return {
    from: env.CONTACT_FROM_EMAIL,
    to: [env.CONTACT_TO_EMAIL],
    reply_to: message.email,
    subject: stripLineBreaks(subject).slice(0, 200),
    text,
  };
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  fetchImpl: typeof fetch,
): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);
  try {
    const response = await fetchImpl(TURNSTILE_ENDPOINT, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

function stringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function stripLineBreaks(value: string) {
  return value.replace(/[\r\n]+/g, " ");
}
