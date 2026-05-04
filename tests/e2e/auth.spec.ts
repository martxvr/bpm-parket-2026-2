import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'bodhi@bpmparket.nl';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin auth', () => {
  test('redirects unauthenticated user from /admin to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Inloggen' })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set — skipping login flow');

    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill('wrong-password-123');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByRole('alert')).toContainText('Onjuist');
  });

  test('successful login redirects to /admin', async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set — skipping login flow');

    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set — skipping login flow');

    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole('button', { name: 'Uitloggen' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
