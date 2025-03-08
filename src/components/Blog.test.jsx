import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"
import { expect, vi } from "vitest"

test('test blog title and author are rendered', async () => {
  const blog = {
    'title': 'Lorem impsum',
    'author': 'John Doe',
    'url': 'https://example.com/a-test',
    'likes': 100,
    'user': {
      'username': 'foo',
      'name': 'bar',
      'id': '67c1a1f1b4c6c465bac79873'
    },
    'id': '67c1a35c985f1c510945b9fc'
  }
  const mockHandlerLike = vi.fn()
  const mockHandlerDelete = vi.fn()

  const { container } = render(<Blog blog={blog} loginUser={blog.user} handleLike={mockHandlerLike} handleDelete={mockHandlerDelete} />)

  const title = container.querySelector('.title')
  expect(title).toHaveTextContent('Lorem impsum')
  
  const author = container.querySelector('.author')
  expect(author).toHaveTextContent('John Doe')

  const details = container.querySelector('.detailsContainer')
  expect(details).toHaveStyle('display: none')

  const hideButton = screen.getByText('hide')
  expect(hideButton).toHaveStyle('display: none')
})

test('test blog url and likes are shown', async () => {
  const blog = {
    'title': 'Lorem impsum',
    'author': 'John Doe',
    'url': 'https://example.com/a-test',
    'likes': 100,
    'user': {
      'username': 'foo',
      'name': 'bar',
      'id': '67c1a1f1b4c6c465bac79873'
    },
    'id': '67c1a35c985f1c510945b9fc'
  }
  const mockHandlerLike = vi.fn()
  const mockHandlerDelete = vi.fn()

  const { container } = render(<Blog blog={blog} loginUser={blog.user} handleLike={mockHandlerLike} handleDelete={mockHandlerDelete} />)

  const user = userEvent.setup()
  const viewButton = container.querySelector('.viewButton')
  await user.click(viewButton)

  const details = container.querySelector('.detailsContainer')
  const hideButton = screen.getByText('hide')

  expect(details).not.toHaveStyle('display: none')
  expect(hideButton).not.toHaveStyle('display: none')
  expect(viewButton).toHaveStyle('display: none')
})