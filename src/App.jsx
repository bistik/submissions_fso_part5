import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

  const blogForm = () => (
    <div>      
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        title:<input type="text" value={newBlog.title} name="title" onChange={handleNewBlogInputChange} /><br/>
        author:<input type="text" value={newBlog.author} name="author" onChange={handleNewBlogInputChange} /><br/>
        url:<input type="text" value={newBlog.url} name="url" onChange={handleNewBlogInputChange} /><br/>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null ? <h2>log in to application</h2> : <h2>blogs</h2>}
      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      {user === null ? loginForm() : blogForm() }
    </div>
  )
}

export default App