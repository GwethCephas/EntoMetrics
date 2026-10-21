import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  { path: "/", h1: "Advancing insect welfare through science and sensing." },
  // The brief's full positioning headline lives on About since the home hero was shortened.
  { path: "/about", h1: /^Pioneering Black Soldier Fly welfare science, micro-climate telemetry, and humane rearing protocols in the Global South\.$/ },
  { path: "/research", h1: "Research programmes" },
  { path: "/research/substrate-telemetry", h1: "Substrate Telemetry and Thermal-Stress Mitigation" },
  { path: "/research/welfare-indicators", h1: "Behavioural and Physiological Welfare Indicators" },
  { path: "/research/humane-slaughter", h1: "Humane Slaughter and Loss-of-Responsiveness Assays" },
  { path: "/telemetry", h1: "Substrate telemetry for tropical farms" },
  { path: "/contact", h1: "Collaboration enquiries" },
  { path: "/privacy", h1: "Privacy Policy" },
  { path: "/data-ethics", h1: "Data and Ethics Statement" },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

for (const route of ROUTES) {
  test(`${route.path} renders directly, on reload, without errors or broken images`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.h1);
    await expect(page).toHaveTitle(/EntoMetrics Africa/);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length).toBeGreaterThan(40);

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.h1);

    const broken = await page.evaluate(async () => {
      const images = [...document.images];
      await Promise.all(
        images.map((img) => {
          img.loading = "eager";
          return img.complete
            ? null
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              });
        }),
      );
      return images.filter((img) => img.naturalWidth === 0).map((img) => img.src);
    });
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
  });

  test(`${route.path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route.path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("page titles are unique", async ({ page }) => {
  const titles = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route.path);
    titles.add(await page.title());
  }
  expect(titles.size).toBe(ROUTES.length);
});

test("unknown routes return a 404 page inside the site layout", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeAttached();

  const programme = await page.goto("/research/not-a-programme");
  expect(programme?.status()).toBe(404);
});

test("navigation, active route and back/forward work", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: "Research Hub" }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expect(nav.getByRole("link", { name: "Research Hub" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: /Programme details for Humane Slaughter/ }).click();
  await expect(page).toHaveURL(/\/research\/humane-slaughter$/);
  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/research\/humane-slaughter$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/research$/);
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Humane Slaughter and Loss-of-Responsiveness Assays");
});

test("hero 'Our approach' scrolls to the About story", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Our approach" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about-heading")).toBeInViewport();
});

test("home previews link to the full content", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Meet the team" }).click();
  await expect(page).toHaveURL(/\/about#team$/);
  await expect(page.locator("#team-heading")).toBeInViewport();
  await expect(page.getByText("Founder and programme builder who has led national innovation programmes")).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: "See the full theory of change" }).click();
  await expect(page).toHaveURL(/\/research#theory-of-change$/);
  await expect(page.locator("#toc-heading")).toBeInViewport();
  await expect(page.getByText("pilot facilities agree to participate")).toBeVisible();
});

test("home page sections appear in the brief's order", async ({ page }) => {
  await page.goto("/");
  const tops = await page.evaluate(() => {
    const order = [
      "#hero-heading",
      "#about-heading",
      "#mission-heading",
      "#programmes-heading",
      "#toc-heading",
      "#team-heading",
      "#collab-heading",
    ];
    return order.map((sel) => document.querySelector(sel)!.getBoundingClientRect().top + window.scrollY);
  });
  expect([...tops].sort((a, b) => a - b)).toEqual(tops);
  await expect(page.getByText("To reduce systemic welfare risks in insect bioconversion systems…")).toBeVisible();
  await expect(
    page.getByText("Protocols and statistical analysis plans will be published before data collection begins.").first(),
  ).toBeAttached();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route.path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("mobile menu opens, navigates and closes at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  const mobile = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobile).toBeVisible();
  await mobile.getByRole("link", { name: "Our Telemetry Tech" }).click();
  await expect(page).toHaveURL(/\/telemetry$/);
  await expect(mobile).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(mobile).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(mobile).toBeHidden();
});

test.describe("contact form (local mode)", () => {
  test("shows validation errors", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Demonstration mode")).toBeVisible();
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please choose a collaboration type.")).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  });

  test("never claims an email was sent without a delivery service", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Organisation").fill("Test Lab");
    await page.getByLabel("Email").fill("test@example.org");
    await page.getByLabel("Collaboration type").selectOption("Scientific research collaboration");
    await page.getByLabel("Message").fill("This is a test enquiry about collaboration on welfare indicators.");
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.locator('[data-result="not-sent"]')).toContainText("Validated, not sent");
    await expect(page.getByText("Message sent")).toHaveCount(0);
  });
});

test.describe("animated About story", () => {
  test("plays each beat, ends in the final state and replays", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    for (const step of [1, 2, 3]) {
      const visual = page.locator(`[data-beat="${step}"] [data-visual]`);
      await visual.scrollIntoViewIfNeeded();
      await expect(visual).toHaveAttribute("data-played", "true");
    }
    const trace = page.locator("[data-trace]");
    await expect.poll(() => trace.evaluate((el) => getComputedStyle(el).strokeDashoffset), { timeout: 6000 }).toBe("0px");
    await expect
      .poll(() => page.locator("[data-alert-chip]").evaluate((el) => getComputedStyle(el).opacity), { timeout: 6000 })
      .toBe("1");
    await expect(page.getByText("Illustrative visualisation. Not field data.").first()).toBeVisible();

    const beat2 = page.locator('[data-beat="2"]');
    await beat2.locator("[data-visual]").scrollIntoViewIfNeeded();
    await beat2.getByRole("button", { name: /Replay animation/ }).click();
    await expect
      .poll(() => page.locator("[data-trace]").evaluate((el) => Number.parseFloat(getComputedStyle(el).strokeDashoffset)))
      .toBeGreaterThan(0);
    await expect
      .poll(() => page.locator("[data-trace]").evaluate((el) => getComputedStyle(el).strokeDashoffset), { timeout: 6000 })
      .toBe("0px");
  });

  test("reduced motion shows final states with no Replay", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Replay animation/ })).toHaveCount(0);
    const state = await page.evaluate(() => ({
      bins: [...document.querySelectorAll("[data-bin]")].every((b) => getComputedStyle(b).fillOpacity === "1"),
      trace: getComputedStyle(document.querySelector("[data-trace]")!).strokeDashoffset,
      chip: getComputedStyle(document.querySelector("[data-alert-chip]")!).opacity,
      pillars: [...document.querySelectorAll("[data-pillar]")].map((p) => getComputedStyle(p).opacity),
    }));
    expect(state).toEqual({ bins: true, trace: "0px", chip: "1", pillars: ["1", "1", "1"] });
    await context.close();
  });
});

test("sitemap, robots and structured data are served", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/research/substrate-telemetry</loc>");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap:");

  await page.goto("/");
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(jsonLd.name).toBe("EntoMetrics Africa");
  expect(jsonLd.sameAs).toContain("https://www.linkedin.com/company/entometrics-africa/");
  expect(jsonLd.email).toBeUndefined();
});
