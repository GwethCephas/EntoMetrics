import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { Header } from "~/components/Header";
import { StatusTimeline } from "~/components/StatusTimeline";
import { StatusBadge } from "~/components/ui";
import { AboutStory } from "~/features/story/AboutStory";
import { setReducedMotion } from "../setup";

afterEach(() => setReducedMotion(false));

describe("StatusBadge and StatusTimeline", () => {
  it("renders the exact status label", () => {
    render(<StatusBadge status="PILOT IN PREPARATION" tone="gold" />);
    expect(screen.getByText("PILOT IN PREPARATION")).toBeInTheDocument();
  });

  it("highlights only the current stage", () => {
    render(<StatusTimeline current="in-preparation" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    const current = items.filter((li) => li.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("In preparation");
    // Status is conveyed in text, not colour alone.
    expect(current[0]).toHaveTextContent("Current stage");
  });
});

// The story links to the Telemetry page, so it needs a router.
const renderStory = () =>
  render(
    <MemoryRouter>
      <AboutStory />
    </MemoryRouter>,
  );

describe("AboutStory", () => {
  it("shows all three beats", () => {
    renderStory();
    expect(screen.getByRole("heading", { name: "Demand is scaling." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A critical blind spot." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our approach." })).toBeInTheDocument();
    expect(screen.getByText("SMS ALERT")).toBeInTheDocument();
  });

  it("offers Replay buttons that keep the visual in place", async () => {
    const user = userEvent.setup();
    const { container } = renderStory();
    const replays = screen.getAllByRole("button", { name: /Replay animation/ });
    expect(replays).toHaveLength(3);
    await user.click(replays[0]!);
    expect(container.querySelectorAll("[data-bin]")).toHaveLength(60);
  });

  it("renders final states with no Replay under reduced motion", () => {
    setReducedMotion(true);
    const { container } = renderStory();
    expect(screen.queryByRole("button", { name: /Replay animation/ })).not.toBeInTheDocument();
    const bin = container.querySelector<SVGRectElement>("[data-bin]")!;
    expect(bin.style.fillOpacity).toBe("1");
    const trace = container.querySelector<SVGPathElement>("[data-trace]")!;
    expect(trace.style.strokeDashoffset).toBe("0");
    for (const pillar of container.querySelectorAll<HTMLElement>("[data-pillar]")) {
      expect(pillar.style.opacity).toBe("");
    }
  });
});

describe("Header", () => {
  function renderHeader() {
    const Stub = createRoutesStub([
      { path: "/", Component: Header },
      { path: "/about", Component: Header },
    ]);
    return render(<Stub initialEntries={["/"]} />);
  }

  it("toggles the mobile menu and closes it on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(mobileNav).getByRole("link", { name: /About Us/ })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu after navigating", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    await user.click(within(mobileNav).getByRole("link", { name: /About Us/ }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
