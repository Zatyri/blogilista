const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [{ _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }]


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
describe('GET /api/blogs', () => {
  test('blogs are returned as json ', async ()=>{  
    await api
      .get('/api/blogs')    
      .expect('Content-Type', /application\/json/)
      .expect(200)
  })

  test('return 2 blogs', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body.length).toBe(2)
  })

  test('returned blog id is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('POST /api/blogs/', () => {
  test('blogs are added to db', async ()=> {
    const newBlog = initialBlogs[2]
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body.length).toBe(3)
    expect(blogs.body[2].id).toBe('5a422b3a1b54a676234d17f9')
  })

  test('if added blogs likes = null, 0 is set by default', async () => {
    const newBlog = {
      title: 'Blog with no likes',
      author: 'Me',
      url: 'http://test.io'    
    }
      
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body[blogs.body.length - 1].likes).toBe(0)
  })

  test('blog post without title and url responds 400 Bad request', async () => {
    const newBlog = {
      author: 'Me'
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
  })
})

describe('DELETE /api/blogs', () => {
  test('delete blog by id and confirm it is deleted', async () => {
    const result = await api.delete(`/api/blogs/${initialBlogs[0]._id}`)
    expect(result.status).toBe(204)

    const blogs = await api.get('/api/blogs')    
    expect(blogs.body[0].id).not.toBe("5a422a851b54a676234d17f7")
    
  })
})

describe('/PUT /api/blogs', () => {
  test('blog updates and returns updated value', async () => {
    const newBlog = initialBlogs[0]
    newBlog.likes = 50
    let result = await api.put(`/api/blogs/${initialBlogs[0]._id}`).send(newBlog)
    expect(result.status).toBe(200)
    result = await api.get('/api/blogs')
    expect(result.body[0].likes).toBe(50)
  })
})


afterAll(() => {
  mongoose.connection.close()
})