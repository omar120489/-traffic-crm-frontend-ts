import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/analytics`);
  });

  test('loads KPI tiles and charts', async ({ page }) => {
    // KPI tiles
    await expect(page.getByText(/Total Activities/i)).toBeVisible();
    await expect(page.getByText(/Active Users/i)).toBeVisible();
    await expect(page.getByText(/Avg Daily/i)).toBeVisible();
    await expect(page.getByText(/Median TTF Response/i)).toBeVisible();

    // Charts visible (role=img on SVG with aria-labels)
    await expect(page.getByRole('img', { name: /Activity by Day line chart/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Activity Mix donut chart/i })).toBeVisible();
    
    // Top Contributors uses semantic markup, check for title
    await expect(page.getByText(/Top Contributors/i)).toBeVisible();
  });

  test('Activity by Day: hover + keyboard tooltips work', async ({ page }) => {
    const chart = page.getByRole('img', { name: /Activity by Day line chart/i });
    
    // Hover to trigger tooltip
    await chart.hover({ position: { x: 120, y: 40 } });
    
    // Wait for tooltip to appear (it shows "Activities: X")
    await page.waitForTimeout(100);
    await expect(page.getByText(/Activities:/)).toBeVisible();

    // Keyboard nav (← →) to move focus point
    await chart.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await expect(page.getByText(/Activities:/)).toBeVisible();
    
    // Test left arrow
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);
    await expect(page.getByText(/Activities:/)).toBeVisible();
  });

  test('Activity Mix: slice hover + legend highlight', async ({ page }) => {
    // Each slice is a <path> with role=button
    const donut = page.getByRole('img', { name: /Activity Mix donut chart/i });
    await expect(donut).toBeVisible();

    // Find first slice button
    const slice = page.getByRole('button', { name: /Call:|Email:|Meeting:|Note:|Task:/i }).first();
    await expect(slice).toBeVisible();

    // Hover to show tooltip
    await slice.hover();
    await page.waitForTimeout(100);
    
    // Tooltip should appear with activity count
    await expect(page.getByText(/activities/i)).toBeVisible();
  });

  test('Top Contributors: bar hover shows tooltip', async ({ page }) => {
    // Find first contributor bar (role=button)
    const bar = page.getByRole('button', { name: /Rivera|Chen|Johnson|Smith|Williams/i }).first();
    await expect(bar).toBeVisible();

    // Hover to show tooltip
    await bar.hover();
    await page.waitForTimeout(100);
    
    // Tooltip should show activities count
    await expect(page.getByText(/activities/i)).toBeVisible();
  });

  test('filters sync to URL', async ({ page }) => {
    // Find date inputs
    const fromInput = page.locator('input[type="date"]').first();
    const toInput = page.locator('input[type="date"]').nth(1);

    await fromInput.fill('2025-09-01');
    await toInput.fill('2025-09-30');

    // Wait for debounce + network
    await page.waitForTimeout(600);

    // Check URL params
    await expect(page).toHaveURL(/from=2025-09-01/);
    await expect(page).toHaveURL(/to=2025-09-30/);
  });

  test('charts handle loading states', async ({ page }) => {
    // On initial load, should see loading skeletons briefly
    // This test verifies the page structure loads correctly
    
    // Wait for charts to finish loading
    await page.waitForTimeout(600);
    
    // All charts should be visible (not loading)
    await expect(page.getByRole('img', { name: /Activity by Day line chart/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Activity Mix donut chart/i })).toBeVisible();
    await expect(page.getByText(/Top Contributors/i)).toBeVisible();
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // All KPIs should still be visible
    await expect(page.getByText(/Total Activities/i)).toBeVisible();
    await expect(page.getByText(/Active Users/i)).toBeVisible();
    
    // Charts should adapt
    await expect(page.getByRole('img', { name: /Activity by Day line chart/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Activity Mix donut chart/i })).toBeVisible();
  });

  test('keyboard navigation through all interactive elements', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab'); // First date input
    await page.keyboard.press('Tab'); // Second date input
    await page.keyboard.press('Tab'); // Reset button
    await page.keyboard.press('Tab'); // Activity by Day chart
    
    // Should be able to interact with chart via keyboard
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await expect(page.getByText(/Activities:/)).toBeVisible();
  });

  test('reset filters button works', async ({ page }) => {
    // Change dates
    const fromInput = page.locator('input[type="date"]').first();
    const toInput = page.locator('input[type="date"]').nth(1);

    await fromInput.fill('2025-09-01');
    await toInput.fill('2025-09-15');
    await page.waitForTimeout(600);

    // Click reset button
    await page.getByRole('button', { name: /Reset to Last 30 Days/i }).click();
    await page.waitForTimeout(600);

    // URL should update to default range
    const url = page.url();
    expect(url).toContain('from=');
    expect(url).toContain('to=');
  });
});
