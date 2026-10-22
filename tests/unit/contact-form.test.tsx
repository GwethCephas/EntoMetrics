import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "~/features/contact/ContactForm";

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderForm(formId: string | null) {
  return render(
    <MemoryRouter>
      <ContactForm formId={formId} />
    </MemoryRouter>,
  );
}

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/^Name/), "Test Person");
  await user.type(screen.getByLabelText(/^Email/), "test@example.org");
  await user.selectOptions(screen.getByLabelText(/^Collaboration type/), "Scientific research collaboration");
  await user.type(screen.getByLabelText(/^Message/), "This is a test enquiry about welfare indicators.");
  return user;
}

describe("ContactForm", () => {
  it("shows Zod validation errors and does not submit", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const user = userEvent.setup();
    renderForm("abc123");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please choose a collaboration type.")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends to Formspree and confirms only after it accepts the message", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchSpy);
    renderForm("abc123");
    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Message sent")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith("https://formspree.io/f/abc123", expect.objectContaining({ method: "POST" }));
    // Form is cleared after a successful send.
    expect(screen.getByLabelText(/^Name/)).toHaveValue("");
  });

  it("keeps the message and reports failure when Formspree rejects it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ errors: [{ message: "nope" }] }, { status: 500 })));
    renderForm("abc123");
    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Not delivered")).toBeInTheDocument();
    expect(screen.queryByText("Message sent")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Test Person");
  });

  it("stays in demonstration mode without a form ID", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    renderForm(null);
    expect(screen.getByText("Demonstration mode")).toBeInTheDocument();
    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: /demo/ }));
    expect(await screen.findByText("Validated, not sent")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
