const listHelper = require('../utils/list_helper')
const blogs = [ 
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7, __v: 0 
  },
  { 
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra', 
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 
    likes: 5, 
    __v: 0 
  },
  { 
    _id: '5a422b3a1b54a676234d17f9', 
    title: 'Canonical string reduction', 
    author: 'Edsger W. Dijkstra', 
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', 
    likes: 12, 
    __v: 0 
  }, 
  { 
    _id: '5a422b891b54a676234d17fa', 
    title: 'First class tests', 
    author: 'Robert C. Martin', 
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', 
    likes: 10, 
    __v: 0 
  }, 
  { 
    _id: '5a422ba71b54a676234d17fb', 
    title: 'TDD harms architecture', 
    author: 'Robert C. Martin', 
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', 
    likes: 0, 
    __v: 0 
  }, 
  { 
    _id: '5a422bc61b54a676234d17fc', 
    title: 'Type wars', 
    author: 'Robert C. Martin', 
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', 
    likes: 2, 
    __v: 0 
  }
]
// tests dummy tests example
test('dummy must return one ',() => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
} )


// tests total likes function
describe('total likes', () => {
     
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogs.slice(0,1))

    expect(result).toBe(7)
  })

  test('when given all blogs it return sum all likes', () => {
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(36)
  })

  test('when given empty list result must be zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})


// tests favourite function
describe('favourite blog', () => {    
  test('when given empty blog list result must be zero', () => {
    expect(listHelper.favourityBlog([])).toBe(0)
  })

  test('when given one blog will be returned blog itself', () => {
    expect(listHelper.favourityBlog(blogs.slice(0,1))).toBe(blogs[0])
  })

  test('when given list of blogs will be returned blog with the most likes', () => {
    expect(listHelper.favourityBlog(blogs)).toBe(blogs[2])
  })
})


// get function mostBlogs (returs author with most blogs)
describe('author with most blogs', () => {
  test('when given empty array must return zero', () => {
    expect(listHelper.mostBlog([])).toBe(0)
  })  
  
  test('when give array of one author must return that author itself', () => {
    const result = listHelper.mostBlog(blogs.slice(0,1))
    
    const expectedRes = {
      author:  'Michael Chan',
      blogs:1
    }

    expect(result).toStrictEqual(expectedRes)
  })

  test('when given list of arrays must return author with the most  blogs', () => {
    const result = listHelper.mostBlog(blogs)
      
    const expectedRes = {
      author: 'Robert C. Martin', 
      blogs: 3
    }

    expect(result).toStrictEqual(expectedRes)
  })
})

// test mostLikes functino should return author who has blog with the most likes
// and total likes of his blogs
describe('author with mostLikes', () => {
  test('when given list of blogs must return author who has the best blog and total likes author has received', () => {
    const result = listHelper.mostLikes(blogs)

    const expectedRes = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(result).toStrictEqual(expectedRes)
  })
})