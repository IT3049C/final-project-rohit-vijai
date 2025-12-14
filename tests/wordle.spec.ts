import { test, expect } from '@playwright/test';

test.describe('Wordle Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('#player-name', 'WordlePlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    await page.goto('/wordle');
  });

  test('loads the initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /wordle/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /enter your guess/i })).toBeVisible();
    await expect(page.locator('.attempts-left')).toContainText('0 / 6');
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.fill('#guess-input', 'HELLO');
    await page.getByRole('button', { name: /submit guess/i }).click();
    
    await expect(page.locator('.guess-row')).toHaveCount(2); // 1 guess + current input
    await expect(page.locator('.attempts-left')).toContainText('1 / 6');
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.fill('#guess-input', 'HELLO');
    await page.getByRole('button', { name: /submit guess/i }).click();
    
    await page.fill('#guess-input', 'WORLD');
    await page.getByRole('button', { name: /submit guess/i }).click();
    
    await page.click('#reset-game');
    
    await expect(page.locator('.attempts-left')).toContainText('0 / 6');
    await expect(page.locator('#guess-input')).toHaveValue('');
  });
});
