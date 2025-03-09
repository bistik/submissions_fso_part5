import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, loginUser, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  return (
    <div className="blog-border">
      <div>
        <span className='title' data-testid="blog-title">{blog.title}</span>
        <span className='author' data-testid="blog-author">{blog.author}</span>
        <button style={hideWhenVisible} onClick={toggleVisibility} className='viewButton'>view</button>
        <button style={showWhenVisible} onClick={toggleVisibility} className='hideButton'>hide</button>
      </div>
      <div style={showWhenVisible} className='detailsContainer'>
        <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
        <br />
        likes {blog.likes} <button onClick={handleLike}>like</button>
        <br />
        {blog.user ? blog.user.name : ''}
        <br />
        {loginUser && blog.user.username === loginUser.username ? <button onClick={handleDelete} className="remove-button">remove</button> : null}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog