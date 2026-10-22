import { describe, expect, it } from "vitest";
import { canonicalRedirect } from "~/lib/canonical";

const SITE = "https://entometrics.com";

describe("canonicalRedirect", () => {
  it("leaves canonical URLs alone", () => {
    expect(canonicalRedirect("https://entometrics.com/", SITE)).toBeNull();
    expect(canonicalRedirect("https://entometrics.com/about", SITE)).toBeNull();
    expect(canonicalRedirect("https://entometrics.com/research/humane-slaughter?x=1", SITE)).toBeNull();
  });

  it("upgrades http to https", () => {
    expect(canonicalRedirect("http://entometrics.com/about", SITE)).toBe("https://entometrics.com/about");
  });

  it("sends www to the bare domain, on http or https", () => {
    expect(canonicalRedirect("https://www.entometrics.com/research", SITE)).toBe("https://entometrics.com/research");
    expect(canonicalRedirect("http://www.entometrics.com/", SITE)).toBe("https://entometrics.com/");
  });

  it("removes trailing slashes except on the home page, keeping the query", () => {
    expect(canonicalRedirect("https://entometrics.com/about/", SITE)).toBe("https://entometrics.com/about");
    expect(canonicalRedirect("https://entometrics.com/contact//?ref=a", SITE)).toBe("https://entometrics.com/contact?ref=a");
  });

  it("never touches other hosts or local previews", () => {
    expect(canonicalRedirect("http://localhost:5173/about/", SITE)).toBeNull();
    expect(canonicalRedirect("http://127.0.0.1:4173/about", SITE)).toBeNull();
    expect(canonicalRedirect("https://entometrics-africa.example.workers.dev/about/", SITE)).toBeNull();
    expect(canonicalRedirect("http://entometrics.com/about", undefined)).toBeNull();
  });
});
