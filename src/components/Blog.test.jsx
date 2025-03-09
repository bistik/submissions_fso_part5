import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect, vi } from 'vitest'

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

test('multiple like clicks', async () => {
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
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandlerLike).toHaveBeenCalledTimes(2)
  expect(mockHandlerLike.mock.calls).toHaveLength(2)
})

test('test new blog form', async () => {
  const newBlog = { title: '', author: '', url: '' }
  const mockHandlerNewBlog = vi.fn()
  const mockHandlerNewBlogInputChange = vi.fn()
  const { container } = render(<BlogForm newBlog={newBlog} handleNewBlog={mockHandlerNewBlog} handleNewBlogInputChange={mockHandlerNewBlogInputChange} />)
  const user = userEvent.setup()

  const titleInput = container.querySelector('input[name="title"]')
  const authorInput = container.querySelector('input[name="author"]')
  const urlInput = container.querySelector('input[name="url"]')
  const submitButton = container.querySelector('button[type="submit"]')
  await user.type(titleInput, '1')
  await user.type(authorInput, '2')
  await user.type(urlInput, '3')
  expect(mockHandlerNewBlogInputChange).toHaveBeenCalledTimes(3)
  expect(mockHandlerNewBlogInputChange.mock.calls).toHaveLength(3)
  await user.click(submitButton)
  expect(mockHandlerNewBlog).toHaveBeenCalledTimes(1)
  expect(mockHandlerNewBlog.mock.calls).toHaveLength(1)
})