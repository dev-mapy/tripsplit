import { describe, it, expect } from "vitest";
import { generateSlug, uniqueSlug } from "./utils";

describe("generateSlug", () => {
  it("converts trip name to URL-safe slug", () => {
    expect(generateSlug("Bali Summer 2026")).toBe("bali-summer-2026");
  });

  it("removes emoji and special characters", () => {
    expect(generateSlug("Bali 🌴 Trip!")).toBe("bali-trip");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("Tokyo  Trip")).toBe("tokyo-trip");
  });

  it("truncates to 50 characters", () => {
    const long = "a".repeat(60);
    expect(generateSlug(long).length).toBeLessThanOrEqual(50);
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });
});

describe("uniqueSlug", () => {
  it("appends a random suffix", () => {
    const slug = uniqueSlug("bali-2026");
    expect(slug).toMatch(/^bali-2026-[a-z0-9]{6}$/);
  });

  it("generates different slugs each time", () => {
    const a = uniqueSlug("bali-2026");
    const b = uniqueSlug("bali-2026");
    expect(a).not.toBe(b);
  });
});
