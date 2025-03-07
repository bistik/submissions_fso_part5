import PropTypes from 'prop-types'

const BlogForm = ({ newBlog, handleNewBlog, handleNewBlogInputChange }) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        title:<input type="text" value={newBlog.title} name="title" onChange={handleNewBlogInputChange} /><br/>
        author:<input type="text" value={newBlog.author} name="author" onChange={handleNewBlogInputChange} /><br/>
        url:<input type="text" value={newBlog.url} name="url" onChange={handleNewBlogInputChange} /><br/>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  newBlog: PropTypes.object.isRequired,
  handleNewBlog: PropTypes.func.isRequired,
  handleNewBlogInputChange: PropTypes.func.isRequired
}

export default BlogForm