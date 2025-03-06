import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const createdBlog = await blogService.create(newBlog)
    blogFormRef.current.toggleVisibility()
    blogs.push(createdBlog)
    setBlogs(blogs)
    setNewBlog({title: '', author: '', url: ''})
    setSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleNewBlogInputChange = async (event) => {
    setNewBlog((newBlog) => ({
      ...newBlog,
      [event.target.name]: event.target.value,
    }))
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const handleLike = async (blog) => {
    const user = blog.user
    const updatedBlog = await blogService.updateBlog({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
    updatedBlog.user = user 
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setSuccessMessage(`${blog.title} by ${blog.author} removed`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }
  

  return (
    <div>
      {user === null ? <h2>log in to application</h2> : <h2>blogs</h2>}
      {user !== null ? <div>{user.name} logged-in <button onClick={handleLogout}>logout</button></div> : null}
      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      {user === null
        ? loginForm()
        : <Toggleable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm newBlog={newBlog} handleNewBlog={handleNewBlog} handleNewBlogInputChange={handleNewBlogInputChange} />
          </Toggleable>
      }
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog 
          key={blog.id} blog={blog} loginUser={user}
          handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog)}
        />
      )}
    </div>
  )
}

export default App