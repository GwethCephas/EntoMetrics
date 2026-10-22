import { describe, expect, it, vi } from "vitest";
import { buildPayload, normaliseFormId, submitContact } from "~/features/contact/formspree";
import { contactSchema } from "~/features/contact/schema";

const valid = {
  name: "Ada Researcher",
  organisation: "Example Lab",
  email: "ada@example.org",
  collaborationType: "Scientific research collaboration",
  message: "We would like to discuss a collaboration on welfare indicators.",
};

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

describe("normaliseFormId", () => {
  it("accepts alphanumeric IDs and rejects anything else", () => {
    expect(normaliseFormId(" xyzabcde ")).toBe("xyzabcde");
    expect(normaliseFormId("")).toBeNull();
    expect(normaliseFormId(undefined)).toBeNull();
    expect(normaliseFormId("../evil")).toBeNull();
  });
});

describe("submitContact (Formspree)", () => {
  it("never reports 'sent' when no form ID is configured", async () => {
    const fetchSpy = vi.fn();
    const result = await submitContact(valid, { formId: null, fetch: fetchSpy });
    expect(result).toEqual({ status: "not-sent", reason: "not-configured" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input without calling Formspree", async () => {
    const fetchSpy = vi.fn();
    const result = await submitContact({ ...valid, email: "bad" }, { formId: "abc123", fetch: fetchSpy });
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors.email).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects honeypot submissions without calling Formspree", async () => {
    const fetchSpy = vi.fn();
    const result = await submitContact(valid, { formId: "abc123", honeypot: "spam.example", fetch: fetchSpy });
    expect(result).toEqual({ status: "rejected" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts JSON to the form endpoint and reports 'sent' only when Formspree accepts it", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    const result = await submitContact(valid, { formId: "abc123", fetch: fetchSpy });
    expect(result).toEqual({ status: "sent" });
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://formspree.io/f/abc123");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Accept: "application/json" });
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ email: valid.email, _replyto: valid.email, message: valid.message });
  });

  it("maps Formspree field errors back onto form fields", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(Response.json({ errors: [{ field: "email", message: "should be an email", code: "TYPE_EMAIL" }] }, { status: 422 }));
    const result = await submitContact(valid, { formId: "abc123", fetch: fetchSpy });
    expect(result).toEqual({ status: "invalid", fieldErrors: { email: "should be an email" } });
  });

  it("reports an error for form-level failures and network errors", async () => {
    const formLevel = vi.fn().mockResolvedValue(Response.json({ errors: [{ message: "Form not found" }] }, { status: 404 }));
    expect(await submitContact(valid, { formId: "abc123", fetch: formLevel })).toEqual({ status: "error" });
    const offline = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await submitContact(valid, { formId: "abc123", fetch: offline })).toEqual({ status: "error" });
  });

  it("builds a single-line subject", () => {
    const payload = buildPayload({ ...valid, name: "Ada\nInjected", organisation: "" } as never);
    expect(payload._subject).not.toMatch(/\n/);
    expect(payload.organisation).toBe("(not given)");
  });
});
