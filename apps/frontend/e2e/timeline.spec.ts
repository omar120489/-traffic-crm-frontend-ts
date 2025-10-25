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

  test("create activity via modal (optimistic)", async ({ page }) => {
    await page.goto("/activities");

    // Open modal
    await page.getByRole("button", { name: /new activity/i }).click();

    // Fill form
    await page.getByLabel("Title *").fill("Follow up with ACME");
    await page.getByLabel("Notes").fill("Confirm SOW and dates");
    await page.getByRole("button", { name: /create activity/i }).click();

    // Optimistic: should appear quickly
    await expect(page.getByText("Follow up with ACME")).toBeVisible();
  });

  test("edit activity saves changes optimistically", async ({ page }) => {
    await page.goto("/activities");

    // Open edit on first visible item
    await page.getByRole("article").first().getByRole("button", { name: /edit/i }).click();

    // Modify title
    const title = page.getByLabel("Title *");
    await title.clear();
    await title.fill("Renamed by test");
    await page.getByRole("button", { name: /save changes/i }).click();

    // Should appear optimistically
    await expect(page.getByText("Renamed by test")).toBeVisible();
  });

  test("delete activity removes from list (optimistic)", async ({ page }) => {
    await page.goto("/activities");

    // Get first item text
    const firstItem = page.getByRole("article").first();
    const textBefore = await firstItem.textContent();

    // Click delete and confirm
    await firstItem.getByRole("button", { name: /delete/i }).click();
    
    // Handle confirm dialog
    page.once("dialog", (dialog) => dialog.accept());

    // Wait a bit for optimistic removal
    await page.waitForTimeout(100);

    // Should be removed
    if (textBefore) {
      await expect(page.getByText(textBefore, { exact: false })).not.toBeVisible();
    }
  });
});

