const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  // compare provided password to the hash
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
    
  // return 401 if user not found or if password id incorect 
  if (!user){
    return response.status(401).json({
      error: 'user not found'
    })
  } else if (!passwordCorrect) {
    return response.status(401).json({
      error: 'provided password is incorect'
    })
  }

  // if user found and password matches
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = await jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .json({ username: user.username, name: user.name, token})
})


module.exports = loginRouter