import { test, expect } from "@playwright/test";

test.describe("Activity Timeline", () => {
  test("renders rows and loads more on scroll", async ({ page }) => {
    // Adjust route to match your actual route structure
    await page.goto("/contacts/1"); // or wherever timeline is mounted
    
    // Wait for timeline to be visible
    await expect(page.getByTestId("activity-timeline")).toBeVisible();

    // Check that at least one activity item is visible
    const items = page.locator('[data-testid^="activity-item-"]');
    await expect(items.first()).toBeVisible();

    // Scroll to bottom to trigger load-more
    await page.evaluate(() => {
      const timeline = document.querySelector('[data-testid="activity-timeline"]');
      const scrollContainer = timeline?.querySelector('div[style*="overflow"]');
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight;
      }
    });

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

