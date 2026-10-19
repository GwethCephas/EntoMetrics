import { z } from "zod";

export const COLLABORATION_TYPES = [
  "Scientific research collaboration",
  "Hardware and telemetry engineering",
  "Producer or pilot facility",
  "Standards and regulation",
  "Funding and grants",
  "Other",
] as const;

/** Shared by the browser form and the server action. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Please keep your name under 120 characters."),
  organisation: z.string().trim().max(160, "Please keep the organisation under 160 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .pipe(z.email("Please enter a valid email address.")),
  collaborationType: z.enum(COLLABORATION_TYPES, "Please choose a collaboration type."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so we can respond usefully.")
    .max(5000, "Please keep your message under 5,000 characters."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Name of the hidden honeypot field. Humans never see or fill it. */
export const HONEYPOT_FIELD = "website";
