import { useState } from "react";

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible);
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  return (
    <div className="blog-border">
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible}>
        <a href={blog.url} target="_blank">{blog.url}</a>
        <br />
        likes {blog.likes} <button onClick={handleLike}>like</button>
        <br />
        {blog.user.name}
       </div>
    </div>
  )
}

export default Blog