import React, { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { userInit } from './reducers/userReducer'
import { displayNotification } from './reducers/notificationReducer'

const App = (props) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.users)
  const notificationR = useSelector(state => state.notification)

  const blogFormRef = useRef()

  // on the first load get all blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => (a.likes < b.likes) ? 1 : -1 )
        dispatch(initializeBlogs(sortedBlogs))
      }
      )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // on the first load get username from localStorage
  useEffect(() => {
    const blogAppUser = window.localStorage.getItem('blogAppUser')
    if (blogAppUser) {
      const user = JSON.parse(blogAppUser)
      dispatch(userInit(user))
      blogService.setToken(user.token)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  
  /* --axios services */
  
  // user login
  const handleLogin = (userObject) => {
    loginService
      .login(userObject)
      .then(user => {
        // save user and its token to localStorage
        window.localStorage.setItem('blogAppUser', JSON.stringify(user))
        // this will set auth. headers to post request
        blogService.setToken(user.token)
        dispatch(userInit(user))
      })
      .catch(() => {
        // notify if login failed
        dispatch(displayNotification('wrong password or username', 3000))
      })
  }

  // blog addition
  const handleBlogAddition = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(postedBlog => {
        // add new blog to the canvas
        dispatch({ type: 'ADD_BLOG', data: postedBlog })
        // make notification
        dispatch(displayNotification('New blog is added', 3000))
      })
      .catch(() => {
        console.log('failed to add a blog')
      })
  }

 
  // blog update
  const handleBlogUpdate = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(updatedBlog => {
        const updatedBlogs = blogs.map(blog => (
          blog.id === id
            ? updatedBlog
            : blog
        ))
        dispatch(initializeBlogs(updatedBlogs))
      })
      .catch((error) => console.log(error.message))
  }

  const handleBlogRemove = (id) => {
    blogService
      .deleteOne(id)
      .then(() => {
        const blogsWithOneRemoved = blogs.filter(blog => blog.id !== id)
        dispatch(initializeBlogs(blogsWithOneRemoved))
      })
      .catch((error) => console.log(error))
  }

  /** handlers and forms*/

  // removes user token from localStoragesetUser
  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser')
    dispatch(userInit(null))
  }

  // returns login form component
  const loginForm = () => {
    return (
      <LoginForm
        handleLogin={handleLogin}
      />
    )
  }

  // returns blog form for posting new blog
  const blogForm = () => {
    return (
      <Togglable buttonLabel='create new Blog' ref={blogFormRef}>
        <BlogForm
          createBlog={handleBlogAddition}
        />
      </Togglable>
    )
  }

  // returns blog Content after user login
  const blogContent = () => {
    return (
      <div>
        {/* logout content */}
        <div>
          {user.username} is logged-in
          <button onClick={handleLogout}>Log out</button>
        </div>

        <h2>Blogs</h2>
        { blogForm() }

        {/* blog list */}
        {
          blogs
            .sort((a, b) => (a.likes < b.likes) ? 1 : -1 )  
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleBlogUpdate={handleBlogUpdate}
                handleBlogRemove={handleBlogRemove}
              />
          )
        }
      </div>
    )
  }

  // main
  return (
    <>
      {
        notificationR && <div className='notification'>{notificationR}</div>
      }
      {
        user === null
          ? loginForm()
          : blogContent()
      }
    </>
  )
}

export default App