import React from 'react'
import { useState } from 'react'

const Blog = ({
  blog,
  handleBlogUpdate,
  handleBlogRemove
}) => {
  const [visible, setVisible] = useState(false)
  const [btnLabel, setBtnLabel] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const toggleVisibility = () => {
    // change btn label
    visible ?
      setBtnLabel('view') :
      setBtnLabel('hide')

    setVisible(!visible)
  }

  const handleLike = () => {
    const updateObj = {
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
    }

    handleBlogUpdate(blog.id, updateObj)
  }

  // confirmation windows to confirm delete blog
  const removeConfirmation = () => {
    if (window.confirm(`do you realy want to delete '${blog.title}'`)) {
      handleBlogRemove(blog.id)
    }
  }

  return (
    <div style={style} className='blog'>
      <div>
        {blog.title}
        <button onClick={toggleVisibility} data-cy='view-hide'>{btnLabel}</button>
      </div>
      <div style={showWhenVisible} className="blogContent">
        <div>{blog.author}</div>
        <div data-cy='likes'>{blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.url}</div>
        <button onClick={removeConfirmation}>remove</button>
      </div>
    </div>
  )
}

export default Blog
