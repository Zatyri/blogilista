const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/',  async (request, response) => {
  try {
    const blogs = await Blog.find({})
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
        
    const blog = new Blog(request.body)
    const saveBlog = await blog.save()    
    response.json(saveBlog.toJSON())    
    if(saveBlog){
      await response.status(201).json(saveBlog.toJSON())
    } else {
      await response.status(400).end()
    }
  } catch (error) {    
    logger.error(error)
    if(process.env.NODE_ENV === 'test'){      
      response.status(400).end()
    }
  }
})

  module.exports = blogsRouter