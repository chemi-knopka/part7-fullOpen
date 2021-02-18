const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users_of_blogs'
  }
})

blogSchema.set('toJSON', {
  transform: (doc, blogObj) => {
    blogObj.id = blogObj._id
    delete blogObj._id
    delete blogObj.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog