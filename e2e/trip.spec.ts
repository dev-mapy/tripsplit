import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Add CSS to disable all animations/transitions to improve stability
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  });
});

test("user can complete a full trip flow", async ({ page }) => {
  await page.goto("/split");

  // Step 1: Setup
  await page.getByPlaceholder(/bali/i).fill("Bali 2026");
  await page.getByRole("button", { name: /continue/i }).click({ force: true });

  // Step 2: Add expense
  await page.getByRole("button", { name: /add expense/i }).click({ force: true });
  await page.getByPlaceholder(/dinner/i).fill("Beach Dinner");
  await page.getByPlaceholder("0.00").fill("90");
  await page.getByRole("button", { name: /add expense ✓/i }).click({ force: true });

  // Step 3: Settlement
  await page.getByRole("button", { name: /calculate/i }).click({ force: true });
  await expect(page.getByText("Settlement Plan")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bali 2026" })).toBeVisible();
});

test("shareable link restores trip state", async ({ page }) => {
  await page.goto("/split");

  // Create a trip
  await page.getByPlaceholder(/bali/i).fill("Link Test Trip");
  await page.getByRole("button", { name: /continue/i }).click({ force: true });

  await page.getByRole("button", { name: /add expense/i }).click({ force: true });
  await page.getByPlaceholder(/dinner/i).fill("Hotel");
  await page.getByPlaceholder("0.00").fill("200");
  await page.getByRole("button", { name: /add expense ✓/i }).click({ force: true });
  await page.getByRole("button", { name: /calculate/i }).click({ force: true });

  // Grab the shareable URL from the current URL
  const sharedUrl = page.url();
  expect(sharedUrl).toContain("?trip=");

  // Open the shared URL in a new page
  const page2 = await page.context().newPage();
  // Disable animations on page2 too
  await page2.addInitScript(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  });
  await page2.goto(sharedUrl);

  // Should show the trip immediately on the result step
  await expect(page2.getByRole("heading", { name: "Link Test Trip" })).toBeVisible();
  await expect(page2.getByText("Settlement Plan")).toBeVisible();
  await expect(page2.getByText("👀")).toBeVisible(); // shared view banner
});

test("cannot continue setup without a trip name", async ({ page }) => {
  await page.goto("/split");
  const btn = page.getByRole("button", { name: /continue/i });
  await expect(btn).toBeDisabled();
});

test("copy button appears on settlement page", async ({ page }) => {
  await page.goto("/split");

  await page.getByPlaceholder(/bali/i).fill("Copy Test");
  await page.getByRole("button", { name: /continue/i }).click({ force: true });
  await page.getByRole("button", { name: /add expense/i }).click({ force: true });
  await page.getByPlaceholder(/dinner/i).fill("Taxi");
  await page.getByPlaceholder("0.00").fill("30");
  await page.getByRole("button", { name: /add expense ✓/i }).click({ force: true });
  await page.getByRole("button", { name: /calculate/i }).click({ force: true });
  
  await expect(page.getByRole("button", { name: /copy/i })).toBeVisible();
});

test("shared link is read-only — edit buttons hidden", async ({ page }) => {
  await page.goto("/split");

  // Create a trip
  await page.getByPlaceholder(/bali/i).fill("Read Only Test");
  await page.getByRole("button", { name: /continue/i }).click({ force: true });

  await page.getByRole("button", { name: /add expense/i }).click({ force: true });
  await page.getByPlaceholder(/dinner/i).fill("Lunch");
  await page.getByPlaceholder("0.00").fill("60");
  await page.getByRole("button", { name: /add expense ✓/i }).click({ force: true });
  await page.getByRole("button", { name: /calculate/i }).click({ force: true });

  // Get the shared URL
  const sharedUrl = page.url();
  expect(sharedUrl).toContain("?trip=");

  // Open in new page (simulates recipient)
  const page2 = await page.context().newPage();
  // Disable animations on page2 too
  await page2.addInitScript(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  });
  await page2.goto(sharedUrl);

  // Read-only banner should be visible
  await expect(page2.getByText("read only")).toBeVisible();
  // Edit and New Trip buttons should NOT be visible
  await expect(page2.getByRole("button", { name: /edit expenses/i })).not.toBeVisible();
  await expect(page2.getByRole("button", { name: /new trip/i })).not.toBeVisible();

  // "Start your own trip" CTA should be visible instead
  await expect(page2.getByRole("link", { name: /start your own trip/i })).toBeVisible();
});
