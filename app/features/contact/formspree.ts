import { contactSchema, type ContactField, type ContactMessage } from "./schema";

/**
 * Contact delivery via Formspree (https://formspree.io). The browser posts the
 * validated message straight to the form endpoint; Formspree re-validates it,
 * filters spam and emails it to the address that owns the form (configured in
 * the Formspree dashboard, not in this code).
 *
 * "sent" is returned only when Formspree accepts the submission. Without a
 * form ID the result is "not-sent": the UI must never imply delivery then.
 */
export type ContactResult =
  | { status: "sent" }
  | { status: "not-sent"; reason: "not-configured" }
  | { status: "invalid"; fieldErrors: Partial<Record<ContactField, string>> }
  | { status: "rejected" }
  | { status: "error" };

const ENDPOINT = "https://formspree.io/f/";
const CONTACT_FIELDS = new Set<string>(["name", "organisation", "email", "collaborationType", "message"]);

/** Formspree form IDs are short alphanumeric strings, e.g. "xyzabcde". */
export function normaliseFormId(value: string | undefined): string | null {
  const id = value?.trim();
  return id && /^[A-Za-z0-9]+$/.test(id) ? id : null;
}

interface FormspreeError {
  field?: string;
  message?: string;
  code?: string;
}

export async function submitContact(
  input: unknown,
  { formId, honeypot = "", fetch: fetchImpl = fetch }: { formId: string | null; honeypot?: string; fetch?: typeof fetch },
): Promise<ContactResult> {
  // Honeypot: a filled hidden field means an automated submission.
  if (honeypot.trim() !== "") return { status: "rejected" };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  if (!formId) return { status: "not-sent", reason: "not-configured" };

  try {
    const response = await fetchImpl(`${ENDPOINT}${formId}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(parsed.data)),
    });
    if (response.ok) return { status: "sent" };

    const body = (await response.json().catch(() => null)) as { errors?: FormspreeError[] } | null;
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const error of body?.errors ?? []) {
      if (error.field && CONTACT_FIELDS.has(error.field) && error.message) {
        fieldErrors[error.field as ContactField] = error.message;
      }
    }
    if (Object.keys(fieldErrors).length > 0) return { status: "invalid", fieldErrors };
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export function buildPayload(message: ContactMessage) {
  return {
    name: message.name,
    organisation: message.organisation || "(not given)",
    email: message.email,
    collaborationType: message.collaborationType,
    message: message.message,
    _subject: `Website enquiry: ${message.collaborationType} from ${message.name}`.replace(/[\r\n]+/g, " ").slice(0, 200),
    _replyto: message.email,
  };
}
