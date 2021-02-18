const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/blog_list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// getting blogs 
describe('when there are some blogs saved', () => {
  test('returns all blogs', async () => {
    const blogs = await api.get('/api/blogs')
  
    expect(blogs.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('unique identifier is "id" not "_id"', async () => {
    const blogs = await api.get('/api/blogs')
  
      
    blogs.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})


// adding blogs
describe('addition of new blog', () => {
  test('blog post is added successfully by post methoed', async () => {
    const forToken = {
      'username': 'root',      
      'password': 'secret'
    }
  
    // generate token for the user (log in)
    const token = await api
      .post('/api/login')
      .send(forToken)
      .expect('content-type', /application\/json/)
    
    // blog to save
    const newBlog = {
      title: 'shotik', 
      author: 'test', 
      url: 'http://test.com', 
      likes: 0 
    }
  
    // post blog
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token.body.token}`)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
  
  test('if likes are missing will be set to zero', async () => {
    const newBlog = {
      title: 'test', 
      author: 'test', 
      url: 'http://test.com'
    }
  
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
  
    expect(res.body.likes).toBe(0)
  })
  
  test('fail 400 if title and url properties are missing', async () => {
    const newBlog = {
      author: 'test'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})


// delete specific note
describe('make action on saved notes', () => {
  test('delete specifig blog', async () => {
    const notesAtStart = await helper.blogsInDb()
    
    const noteToDelete = notesAtStart[0]
  
    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .expect(204)
  
    const notesAtEnd = await helper.blogsInDb()
    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1) 
  })

  test('likes will be updated in blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newLikes = {
      likes: 999
    }
    
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
    
    expect(updatedBlog.body.likes).toBe(newLikes.likes)
  })
})


// test if new user is added successfully
describe('when there is one initial user in db', () => {
  // delete all users and add 'root' user before each test
  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

  })

  // adding new user
  test('creation succeds to create new fresh user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test', 
      name: 'test',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('create new user fails 400 status if the username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root', 
      name: 'test', 
      password: 'test'
    }

    const result =  await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('content-type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})