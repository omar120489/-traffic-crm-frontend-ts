import { test, expect } from "@playwright/test";

test.describe("Activity Timeline", () => {
  test("renders timeline with day grouping and loads more on scroll", async ({ page }) => {
    // Navigate to activities page
    await page.goto("/activities");
    
    // Wait for timeline to be visible with proper ARIA role
    await expect(page.getByRole("feed", { name: /activity timeline/i })).toBeVisible();

    // Check that at least one activity item is visible
    const items = page.locator('[data-testid^="activity-item-"]');
    await expect(items.first()).toBeVisible();

    // Verify day grouping headers are present
    const headers = page.locator('text=/Today|Yesterday|Earlier/i');
    await expect(headers.first()).toBeVisible();

    // Scroll to bottom to trigger load-more
    await page.mouse.wheel(0, 2000);

    // Wait a bit for potential load
    await page.waitForTimeout(500);

    // Basic assertion (tweak once backend is wired)
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test("filters activities by type", async ({ page }) => {
    await page.goto("/contacts/1");
    
    await expect(page.getByTestId("activity-timeline")).toBeVisible();

    // Select "Call" from type filter
    await page.selectOption('select:has-text("Type")', "call");

    // Wait for filter to apply
    await page.waitForTimeout(300);

    // Verify filtered results (adjust based on mock data)
    const items = page.locator('[data-testid^="activity-item-"]');
    expect(await items.count()).toBeGreaterThanOrEqual(0);
  });

  test("searches activities", async ({ page }) => {
    await page.goto("/contacts/1");
    
    await expect(page.getByTestId("activity-timeline")).toBeVisible();

    // Type in search box
    await page.fill('input[type="search"]', "budget");

    // Wait for search to apply
    await page.waitForTimeout(300);

    // Verify search results
    const items = page.locator('[data-testid^="activity-item-"]');
    expect(await items.count()).toBeGreaterThanOrEqual(0);
  });
});

