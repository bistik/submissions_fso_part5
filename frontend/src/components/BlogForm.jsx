import PropTypes from 'prop-types'

const BlogForm = ({ newBlog, handleNewBlog, handleNewBlogInputChange }) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        title:<input type="text" value={newBlog.title} name="title" onChange={handleNewBlogInputChange} data-testid="title" /><br/>
        author:<input type="text" value={newBlog.author} name="author" onChange={handleNewBlogInputChange} data-testid="author" /><br/>
        url:<input type="text" value={newBlog.url} name="url" onChange={handleNewBlogInputChange} data-testid="url" /><br/>
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