const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')


// const getTokenFrom = (request) => {
//   const authorizationHeader = request.get('authorization')
//   if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
//     return authorizationHeader.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  
  // get token using middleware which saved it in the request object
  const tokenUser = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !tokenUser) {
    return response.status(401).json({ error: 'invalid token person is not authorized'})
  }

  // else if user exists with provided token find that user
  const user = await User.findById(tokenUser.id)
  user.blogs = user.blogs.concat(blog.id)
  await user.save()
  

  // if likes property is missing add property likes and set 0 its value
  if (blog['likes'] === undefined) {
    blog.likes = 0
  }

  // save blog
  blog.user = user.id
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  // get blog for user id
  const blogForUserId = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  
  const blog = {
    user: blogForUserId.user._id,
    likes: body.likes,
    author: body.author,
    title: body.title,
    url: body.url
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true} )
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const tokenUser = jwt.verify(request.token, process.env.SECRET)
  
  // check if token is provided
  if (!request.token || !tokenUser) {
    return response.status(401).json({ error: 'invalid token'})
  }

  // findUser of provided 'token' and find blog of provided 'id'
  const user = await User.findById(tokenUser.id)
  const blog = await Blog.findById(request.params.id)
  
  // compare blog user id and token user if they match delete blog
  if (blog.user.toString() === user.id) {
    await blog.remove()
    response.status(204).end()
  } else {
    return response.status(400).json({ error: 'user doesn\'t have delete permision'})
  }
})

blogsRouter.get('/reset', async (req, res) => {
  await Blog.deleteMany({})
  res.status(204).end()
})

module.exports = blogsRouter