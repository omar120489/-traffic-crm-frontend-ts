import { test, expect } from '@playwright/test';

/**
 * Sprint 2 Smoke Tests
 * Critical flows: create contact → tag it → add note, create deal → change stage
 */

test.describe('Sprint 2 Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Setup auth/login flow
    await page.goto('/');
  });

  test('create contact → tag it → add note', async ({ page }) => {
    // Navigate to contacts
    await page.goto('/contacts');
    await expect(page.locator('h1')).toContainText('Contacts');

    // Create new contact
    await page.click('button:has-text("New Contact")');
    await page.fill('input[name="name"]', 'Test Contact');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Save")');

    // Verify contact created
    await expect(page.locator('text=Test Contact')).toBeVisible();

    // Add tag
    await page.click('button:has-text("Add Tag")');
    await page.fill('input[placeholder="Tag name"]', 'VIP');
    await page.click('button:has-text("Create Tag")');
    await expect(page.locator('.tag:has-text("VIP")')).toBeVisible();

    // Add note
    await page.click('button:has-text("Add Note")');
    await page.fill('textarea[name="body"]', 'Follow up next week');
    await page.click('button:has-text("Save Note")');
    await expect(page.locator('text=Follow up next week')).toBeVisible();
  });

  test('create deal → change stage → verify history', async ({ page }) => {
    // Navigate to deals
    await page.goto('/deals');
    await expect(page.locator('h1')).toContainText('Deals');

    // Create new deal
    await page.click('button:has-text("New Deal")');
    await page.fill('input[name="title"]', 'Test Deal');
    await page.fill('input[name="amountCents"]', '100000');
    await page.selectOption('select[name="stageId"]', { index: 0 });
    await page.click('button:has-text("Save")');

    // Verify deal created
    await expect(page.locator('text=Test Deal')).toBeVisible();

    // Change stage
    await page.click('text=Test Deal');
    await page.selectOption('select[name="stageId"]', { index: 1 });
    await page.click('button:has-text("Update Stage")');

    // Verify stage change in timeline
    await expect(page.locator('.timeline')).toContainText('Stage changed');
  });

  test('pipeline management', async ({ page }) => {
    // Navigate to settings/pipelines
    await page.goto('/settings/pipelines');

    // Create new pipeline
    await page.click('button:has-text("New Pipeline")');
    await page.fill('input[name="name"]', 'Test Pipeline');
    await page.click('button:has-text("Save")');

    // Add stages
    await page.click('button:has-text("Add Stage")');
    await page.fill('input[name="stageName"]', 'Discovery');
    await page.fill('input[name="probability"]', '25');
    await page.click('button:has-text("Save Stage")');

    await expect(page.locator('text=Discovery')).toBeVisible();
  });

  test('tag filtering', async ({ page }) => {
    await page.goto('/contacts');

    // Apply tag filter
    await page.click('button:has-text("Filter")');
    await page.click('text=VIP');
    await page.click('button:has-text("Apply")');

    // Verify filtered results
    await expect(page.locator('.contact-row')).toHaveCount(1);
    await expect(page.locator('text=Test Contact')).toBeVisible();
  });
});


