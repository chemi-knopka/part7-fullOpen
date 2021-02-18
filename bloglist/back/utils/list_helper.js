const _ = require('lodash')

// just dummy test
const dummy = (blogs) => {
  return 1
}

// returns sum of likes 
const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

// returns blog with the most likes
const favourityBlog = (blogs) => {
  if (blogs.length === 0){return 0}

  const bestBlog = blogs.reduce((prev, current) => {
    return (prev.likes >= current.likes) ? prev : current
  })

  return bestBlog
}

// returns author with the most blogs and blogs count
const mostBlog = (blogs) => {
  if (blogs.length === 0) {return 0}
  
  // group array by authors 
  const res = _.groupBy(blogs, (blog) => blog.author)
  
  // since _.groupBy() function returns an object, convert it to an array
  const entries = Object.entries(res)

  // sort by blogs number authors have
  const sorted = _.sortBy(entries, (item) => item[1].length)

  // get name and total blog number of the last one
  const bestAuthorName = sorted[sorted.length-1][0]
  const totalBlogs = sorted[sorted.length-1][1].length

  return {
    author: bestAuthorName,
    blogs: totalBlogs
  }

}

// returns author who has blog with the most likes and total likes of his blogs
const mostLikes = (blogs) => {
  if (blogs.length === 0) {return 0}
  
  // sort all blogs by likes and take author name of the last one
  const famousAuthor = _.sortBy(blogs, (blog) => blog.likes)[blogs.length -1 ].author
  
  // get all likes the author has
  const totalLikes = blogs
    .filter(({author}) => author === famousAuthor )
    .reduce((sum, item) => {return sum + item.likes}, 0)

  return {
    author: famousAuthor,
    likes: totalLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favourityBlog,
  mostBlog,
  mostLikes
}