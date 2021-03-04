import React from 'react'
import {useParams} from 'react-router-dom'

const BlogContent = ({blogs, handleBlogUpdate}) => {
    const id = useParams().id
    const blog = blogs.find(blog => blog.id === id)
    
    if(!blog) {
        return null
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
    
    return (
        <div>
            <div>
                <h2>{ blog.title }</h2>
            </div> 
           <div><strong>url: </strong> { blog.url} </div>
           <div><strong>author: </strong> { blog.author } </div>
           <div>
              <strong>likes:</strong> {blog.likes} <button onClick={handleLike}>like</button>
           </div>

        </div>
    )
}

export default BlogContent