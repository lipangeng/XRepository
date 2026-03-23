import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'admin')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'wrong')
    await page.click('button[type="submit"]')
    
    await expect(page.getByText('Login failed')).toBeVisible()
  })
})
