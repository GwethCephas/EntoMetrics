import { useEffect, useId, useRef, type ReactNode, type Ref } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Link, useFetcher } from "react-router";
import { buttonClassName } from "~/components/ui";
import { site } from "~/data/site";
import { COLLABORATION_TYPES, contactSchema, HONEYPOT_FIELD, type ContactField, type ContactInput } from "./schema";
import type { ContactResult } from "./submit.server";
import { zodResolver } from "./zodResolver";

interface ContactFormProps {
  emailConfigured: boolean;
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export function ContactForm({ emailConfigured }: ContactFormProps) {
  const fetcher = useFetcher<ContactResult>();
  const statusRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", organisation: "", email: "", message: "", collaborationType: undefined },
    mode: "onTouched",
  });

  const submitting = fetcher.state !== "idle";
  const result = fetcher.state === "idle" ? fetcher.data : undefined;

  useEffect(() => {
    if (!result) return;
    if (result.status === "invalid") {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as ContactField, { type: "server", message });
      }
      return;
    }
    if (result.status === "sent") reset();
    statusRef.current?.focus();
  }, [result, setError, reset]);

  const onSubmit = handleSubmit((_values, event) => {
    const form = event?.target as HTMLFormElement | undefined;
    if (!form) return;
    fetcher.submit(new FormData(form), { method: "post" });
  });

  return (
    <div>
      {!emailConfigured ? (
        <div role="note" className="mb-8 rounded-[var(--radius-card)] border border-gold bg-gold/10 p-4 text-[0.9375rem]">
          <p className="font-mono text-label uppercase text-ink">Demonstration mode</p>
          <p className="mt-1 text-ink">
            Email delivery is not configured in this environment. The form checks your entries but{" "}
            <strong>does not send them</strong>. To reach us now, email{" "}
            <a className="text-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      ) : null}

      <ResultMessage result={result} ref={statusRef} />

      <form method="post" noValidate onSubmit={onSubmit} aria-busy={submitting} className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message} required registration={register("name")} autoComplete="name" />
          <Field
            label="Organisation"
            hint="Optional"
            error={errors.organisation?.message}
            registration={register("organisation")}
            autoComplete="organization"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Email"
            type="email"
            error={errors.email?.message}
            required
            registration={register("email")}
            autoComplete="email"
          />
          <SelectField label="Collaboration type" error={errors.collaborationType?.message} registration={register("collaborationType")} />
        </div>
        <TextAreaField label="Message" error={errors.message?.message} registration={register("message")} />

        {/* Honeypot: visually hidden and skipped by keyboard and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {TURNSTILE_SITE_KEY ? (
          <>
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className={buttonClassName("primary")} disabled={submitting}>
            {submitting ? "Submitting…" : emailConfigured ? "Send enquiry" : "Check and submit (demo)"}
          </button>
          <p className="text-[0.875rem] text-ink-70">
            We use these details only to reply to your enquiry. See our{" "}
            <Link className="text-link" to="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}

function ResultMessage({ result, ref }: { result: ContactResult | undefined; ref: Ref<HTMLDivElement> }) {
  let tone: "success" | "neutral" | "error" = "neutral";
  let title = "";
  let body = "";

  switch (result?.status) {
    case "sent":
      tone = "success";
      title = "Message sent";
      body = "Thank you. Your enquiry has been delivered and we will reply by email.";
      break;
    case "not-sent":
      title = "Validated, not sent";
      body = `Your message passed validation but was not sent: email delivery is not configured in this environment. Please email ${site.email} directly.`;
      break;
    case "rejected":
      tone = "error";
      title = "Not submitted";
      body = `Your message could not be submitted. Please email ${site.email} directly.`;
      break;
    case "error":
      tone = "error";
      title = "Not delivered";
      body = `Something went wrong and your message was not delivered. Please try again, or email ${site.email}.`;
      break;
    case "invalid":
      tone = "error";
      title = "Please check the form";
      body = "Some fields need attention.";
      break;
  }

  const toneClass = {
    success: "border-forest bg-forest/5",
    neutral: "border-gold bg-gold/10",
    error: "border-[#9b2c2c] bg-[#9b2c2c]/5",
  }[tone];

  return (
    <div ref={ref} tabIndex={-1} role="status" aria-live="polite" className="outline-none" data-result={result?.status ?? ""}>
      {result ? (
        <div className={`mb-8 rounded-[var(--radius-card)] border p-4 ${toneClass}`}>
          <p className="font-semibold text-ink">{title}</p>
          <p className="mt-1 text-[0.9375rem] text-ink">{body}</p>
        </div>
      ) : null}
    </div>
  );
}

const inputClass =
  "mt-2 block w-full rounded-[var(--radius-card)] border bg-white px-3.5 py-3 text-base text-ink placeholder:text-ink-70/70 focus:border-forest focus:outline-2 focus:outline-offset-0 focus:outline-forest aria-[invalid=true]:border-[#9b2c2c]";

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  registration: UseFormRegisterReturn;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  required,
  children,
}: Omit<BaseFieldProps, "registration"> & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.9375rem] font-medium text-ink">
        <span>
          {label}
          {required ? (
            <span aria-hidden className="ml-0.5 text-ink-70">
              *
            </span>
          ) : null}
        </span>
        {hint ? <span className="font-mono text-[0.75rem] font-normal text-ink-70">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.875rem] text-[#9b2c2c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  type = "text",
  autoComplete,
  ...props
}: BaseFieldProps & { type?: string; autoComplete?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${id}-error` : undefined}
        aria-required={props.required || undefined}
        className={`${inputClass} ${props.error ? "border-[#9b2c2c]" : "border-rule-strong"}`}
        {...props.registration}
      />
    </FieldShell>
  );
}

function SelectField(props: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} required {...props}>
      <select
        id={id}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${id}-error` : undefined}
        aria-required
        defaultValue=""
        className={`${inputClass} ${props.error ? "border-[#9b2c2c]" : "border-rule-strong"}`}
        {...props.registration}
      >
        <option value="" disabled>
          Choose one
        </option>
        {COLLABORATION_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function TextAreaField(props: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} required {...props}>
      <textarea
        id={id}
        rows={7}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${id}-error` : undefined}
        aria-required
        className={`${inputClass} ${props.error ? "border-[#9b2c2c]" : "border-rule-strong"}`}
        {...props.registration}
      />
    </FieldShell>
  );
}
