const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const auth = request.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')){
    return auth.substring(7)
  }
  return null
}

blogsRouter.get('/',  async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (error ) {
    logger.error(error)
  }
})

blogsRouter.get('/:id',  async (request, response) => {
  try {
    const blog = Blog.findById(request.params.id)
    if(blog){
      await response.json(blog.toJSON())
    } else {
      await response.status(404).end()
    }
  } catch (error) {
    logger.error(error)
  }
})
  
blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log(decodedToken);
    
    if(!token || !decodedToken.id){
      
      
      return response.status(401).json({error: 'token missing or invalid'})
    }
    
    const user = await User.findById(decodedToken.id)    
    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const saveBlog = await blog.save()    
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.json(saveBlog.toJSON())
    
  } catch (error) {    
    logger.error(error)
    if(process.env.NODE_ENV === 'test'){      
      response.status(400).end()
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const result = await blog.findByIdAndRemove(request.params.id)
    await response.status(result ? 204 : 404).end()
  } catch (error) {
    logger.error(error)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlog = request.body  
  

  try {
    const result = await blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.status(200)
    response.json(result.toJSON)
  } catch (error) {
    logger.error(error)
  }
})

  module.exports = blogsRouter