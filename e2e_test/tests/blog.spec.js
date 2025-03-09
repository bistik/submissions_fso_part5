const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await createBlog(page, 'test title', 'test author', 'https://example.com')
      const messageDiv = await page.locator('.message')
      await expect(messageDiv).toContainText('a new blog test title by test author added')
      await expect(page.getByTestId('blog-title')).toBeVisible()
      await expect(page.getByTestId('blog-author')).toBeVisible()
    })
  })

  describe('When blog exists', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
      await createBlog(page, 'test title', 'test author', 'https://example.com')
    })
    test('a blog can be liked', async ({ page }) => {
      await page.click('text="view"')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.likes')).toContainText('likes 1')
    })
  })
})