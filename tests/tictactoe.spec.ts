import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('#player-name', 'TicPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    await page.goto('/tictactoe');
  });

  test('loads the initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tic tac toe/i })).toBeVisible();
    await expect(page.locator('#current-player')).toContainText('X');
    
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(9);
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.locator('[data-cell="0"]').click();
    await expect(page.locator('[data-cell="0"]')).toContainText('X');
    
    await page.locator('[data-cell="1"]').click();
    await expect(page.locator('[data-cell="1"]')).toContainText('O');
    
    await expect(page.locator('#current-player')).toContainText('X');
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.locator('[data-cell="0"]').click();
    await page.locator('[data-cell="1"]').click();
    await page.locator('[data-cell="2"]').click();
    
    await page.click('#reset-game');
    
    const cells = page.locator('.cell');
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toHaveText('');
    }
    
    await expect(page.locator('#current-player')).toContainText('X');
  });
});
