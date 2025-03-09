const { expect } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.click('text="new blog"')
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const logout = async (page) => {
  const logoutButton = await page.getByRole('button', { name: 'logout' })
  await expect(logoutButton).toBeVisible()
  await logoutButton.click()
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
}

export { loginWith, createBlog, logout }