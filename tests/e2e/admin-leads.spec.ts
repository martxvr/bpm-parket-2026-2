import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'bodhi@bpmparket.nl';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin paneel', () => {
  test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set');

  test('admin can list leads after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/leads');
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();
  });

  test('admin dashboard shows stat cards', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.getByText('Nieuwe leads')).toBeVisible();
    await expect(page.getByText('Open afspraken')).toBeVisible();
    await expect(page.getByText('Kennisbank')).toBeVisible();
  });

  test('admin can navigate to all sections', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    for (const section of ['Leads', 'Afspraken', 'Kennisbank', 'Projecten', 'Gallery', 'Instellingen']) {
      await page.getByRole('link', { name: section }).first().click();
      await expect(page.getByRole('heading', { name: section })).toBeVisible();
    }
  });
});
