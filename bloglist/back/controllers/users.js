const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined || body.password.length < 3 ){
    return response.status(400).json({ error: 'password is not provided or it is less the 3 charactes'})
  }
  const passwordHash = await bcrypt.hash(body.password, 10)
    
  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await newUser.save()
  response.json(savedUser)
})

module.exports = usersRouter