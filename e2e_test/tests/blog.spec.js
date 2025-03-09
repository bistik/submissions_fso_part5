const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        "username": "test",
        "name": "test",
        "password": "password"
      }
    })
    await page.goto('http://localhost:5173')
  })

  
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'password')
      await expect(page.getByText('logged-in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test', 'invalid-password')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
    })
    test('a new blog can be created', async ({ page }) => {
      await page.click('text="new blog"')
      await page.getByTestId('title').fill('test title')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('https://example.com')
      await page.getByRole('button', { name: 'create' }).click()
      const messageDiv = await page.locator('.message')
      await expect(messageDiv).toContainText('a new blog test title by test author added')
      await expect(page.getByTestId('blog-title')).toBeVisible()
      await expect(page.getByTestId('blog-author')).toBeVisible()
    })
  })
})