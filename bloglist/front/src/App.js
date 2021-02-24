import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import BlogContent from './components/BlogContent'

import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { userInit } from './reducers/userReducer'
import { displayNotification } from './reducers/notificationReducer'

import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  const blogFormRef = useRef()

  const [users, setUsers] = useState([])

  // on the first load get all blogs and get all users
  useEffect(() => {
    // get blogs
    blogService
      .getAll()
      .then(blogs => {
          const sortedBlogs = blogs.sort((a, b) => (a.likes < b.likes) ? 1 : -1 )
          dispatch(initializeBlogs(sortedBlogs))
        }
      )
    
    // get users
    userService
      .getAll()
      .then((users) => {
          setUsers(users)
      })
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

  // const handleBlogRemove = (id) => {
  //   blogService
  //     .deleteOne(id)
  //     .then(() => {
  //       const blogsWithOneRemoved = blogs.filter(blog => blog.id !== id)
  //       dispatch(initializeBlogs(blogsWithOneRemoved))
  //     })
  //     .catch((error) => console.log(error))
  // }

  /** handlers and forms*/

  // removes user token from localStoragesetUser
  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser')
    dispatch(userInit(null))
  }

  // returns login form component
  const displayLoginForm = () => {
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

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
    return (
      <div>
        <h2>Blogs</h2>
        { blogForm() }

        {/* blog list */}

        {blogs
          .sort((a, b) => (a.likes < b.likes) ? 1 : -1 )
          .map(blog => 
            <div key={blog.id} style={style}>
              <Link to={`/blogs/${blog.id}`} >{blog.title}</Link>
            </div>
            )
        }
      </div>
    )
  }

  const Header = () => {
    const style={padding: 5}

    return (
      <div>
        {/* logout content */ }
        <div>
          {user.username} is logged-in
          <button onClick={handleLogout}>Log out</button>
        </div>
        
        <div>
            <Link style={style} to='/'>Home</Link>
            <Link style={style} to='/users'>Users</Link>
        </div>
      </div>
    )
  }

  const User = () => {
    const id = useParams().id
    const userToDisplay = users.find(user => user.id === id)

    if (!userToDisplay) {
      return null 
    }
    return (
      <div>
        <h2>{userToDisplay.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {userToDisplay.blogs.map((blog,i) => 
            <li key={i}>{blog.title}</li>  
          )}
        </ul>
      </div>
    )
  }


  // main
  return (
    <Router>
      {
          notification && <div className='notification'>{notification}</div>
      }
        {
            user !== null
              ? (<div>
                  { Header() }
                  <Switch>
                    <Route path='/users/:id'>
                      <User />
                    </Route>
                    <Route path='/blogs/:id'>
                      <BlogContent 
                        blogs={blogs}
                        handleBlogUpdate={handleBlogUpdate}
                      />
                    </Route>
                    <Route path='/users'>
                      <Users users={users} />
                    </Route>
                    <Route path='/'>
                      {
                        user === null
                          ? displayLoginForm()
                          : blogContent()
                      }
                    </Route>
                  </Switch>
                </div>)
              : displayLoginForm()
        }
        
    </Router>
  )
}

export default App