import { describe, expect, it, vi } from "vitest";
import { contactSchema } from "~/features/contact/schema";
import { handleContactSubmission } from "~/features/contact/submit.server";

const valid = {
  name: "Ada Researcher",
  organisation: "Example Lab",
  email: "ada@example.org",
  collaborationType: "Scientific research collaboration",
  message: "We would like to discuss a collaboration on welfare indicators.",
};

function formData(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.append(k, v);
  return fd;
}

describe("contactSchema", () => {
  it("accepts a valid message and trims input", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Ada Researcher  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Ada Researcher");
  });

  it("rejects invalid email, short message and unknown type", () => {
    const result = contactSchema.safeParse({ ...valid, email: "nope", message: "short", collaborationType: "x" });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["email", "message", "collaborationType"]));
  });

  it("allows an empty organisation", () => {
    expect(contactSchema.safeParse({ ...valid, organisation: "" }).success).toBe(true);
  });
});

describe("handleContactSubmission", () => {
  it("never reports 'sent' when email is not configured", async () => {
    const fetchSpy = vi.fn();
    const result = await handleContactSubmission(formData(valid), { env: {}, fetch: fetchSpy });
    expect(result).toEqual({ status: "not-sent", reason: "not-configured" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const result = await handleContactSubmission(formData({ ...valid, email: "bad" }), { env: {} });
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors.email).toBeTruthy();
  });

  it("rejects honeypot submissions without calling the provider", async () => {
    const fetchSpy = vi.fn();
    const env = { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "to@x.org", CONTACT_FROM_EMAIL: "from@x.org" };
    const result = await handleContactSubmission(formData({ ...valid, website: "spam.example" }), { env, fetch: fetchSpy });
    expect(result).toEqual({ status: "rejected" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports 'sent' only after the provider accepts the message", async () => {
    const env = { RESEND_API_KEY: "secret", CONTACT_TO_EMAIL: "to@x.org", CONTACT_FROM_EMAIL: "from@x.org" };
    const fetchSpy = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const result = await handleContactSubmission(formData(valid), { env, fetch: fetchSpy });
    expect(result).toEqual({ status: "sent" });
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(init.body as string);
    expect(body.to).toEqual(["to@x.org"]);
    expect(body.reply_to).toBe(valid.email);
  });

  it("reports an error when the provider fails", async () => {
    const env = { RESEND_API_KEY: "secret", CONTACT_TO_EMAIL: "to@x.org", CONTACT_FROM_EMAIL: "from@x.org" };
    const fetchSpy = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await handleContactSubmission(formData(valid), { env, fetch: fetchSpy });
    expect(result).toEqual({ status: "error" });
  });

  it("rejects when Turnstile is enabled and verification fails", async () => {
    const env = { TURNSTILE_SECRET_KEY: "ts" };
    const fetchSpy = vi.fn().mockResolvedValue(Response.json({ success: false }));
    const result = await handleContactSubmission(formData({ ...valid, "cf-turnstile-response": "tok" }), {
      env,
      fetch: fetchSpy,
    });
    expect(result).toEqual({ status: "rejected" });
  });
});
