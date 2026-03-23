import { test, expect } from '@playwright/test'

test.describe('Repository Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'admin')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('should navigate to repositories page', async ({ page }) => {
    await page.goto('/repos')
    await expect(page.getByText('Repositories')).toBeVisible()
  })

  test('should create a new repository', async ({ page }) => {
    await page.goto('/repos')
    
    await page.click('text=Create Repository')
    await expect(page.getByText('Create Repository')).toBeVisible()
    
    await page.fill('input[placeholder="my-repo"]', 'docker-test')
    await page.selectOption('select', 'hosted')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/repos')
  })
})
