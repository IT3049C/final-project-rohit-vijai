import { test, expect } from '@playwright/test';

test.describe('Game Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('loads the landing page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /game hub/i })).toBeVisible();
    await expect(page.locator('.developer')).toBeVisible();
  });

  test('lists available games', async ({ page }) => {
    const games = page.locator('.game-card');
    await expect(games).toHaveCount(4);
    await expect(games.first()).toContainText('Rock Paper Scissors');
  });

  test('captures a player name', async ({ page }) => {
    await page.fill('#player-name', 'TestPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    
    await expect(page.locator('[data-testid="greeting"]')).toContainText('TestPlayer');
  });

  test('navigates from hub into all game pages and back', async ({ page }) => {
    await page.fill('#player-name', 'Navigator');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    // Navigate to RPS
    await page.getByRole('button', { name: /play rock paper scissors/i }).click();
    await expect(page).toHaveURL(/\/rps/);
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');

    // Navigate to Tic Tac Toe
    await page.getByRole('button', { name: /play tic tac toe/i }).click();
    await expect(page).toHaveURL(/\/tictactoe/);
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');

    // Navigate to Wordle
    await page.getByRole('button', { name: /play wordle/i }).click();
    await expect(page).toHaveURL(/\/wordle/);
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');

    // Navigate to Memory
    await page.getByRole('button', { name: /play memory/i }).click();
    await expect(page).toHaveURL(/\/memory/);
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('player name is displayed on all game pages', async ({ page }) => {
    await page.fill('#player-name', 'GlobalPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    const games = ['/rps', '/tictactoe', '/wordle', '/memory'];
    
    for (const gamePath of games) {
      await page.goto(gamePath);
      await expect(page.locator('[data-testid="player-name"]')).toContainText('GlobalPlayer');
    }
  });
});
