import { test, expect } from '@playwright/test';

test.describe('Rock Paper Scissors Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('#player-name', 'RPSPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    await page.goto('/rps');
  });

  test('loads the initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /rock paper scissors/i })).toBeVisible();
    await expect(page.locator('#score-player')).toHaveText('0');
    await expect(page.locator('#score-cpu')).toHaveText('0');
    await expect(page.locator('#score-ties')).toHaveText('0');
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.getByRole('button', { name: /rock/i }).click();
    await expect(page.locator('#history li')).toHaveCount(1);
    
    await page.getByRole('button', { name: /paper/i }).click();
    await expect(page.locator('#history li')).toHaveCount(2);
    
    await page.getByRole('button', { name: /scissors/i }).click();
    await expect(page.locator('#history li')).toHaveCount(3);
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.locator('[data-move="rock"]').click();
    await page.locator('[data-move="paper"]').click();
    await page.locator('[data-move="scissors"]').click();
    
    await page.click('#reset-game');
    
    await expect(page.locator('#score-player')).toHaveText('0');
    await expect(page.locator('#score-cpu')).toHaveText('0');
    await expect(page.locator('#score-ties')).toHaveText('0');
    await expect(page.locator('#history li')).toHaveCount(0);
  });
});
