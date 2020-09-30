const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/',  async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1}).populate('comments',{comment: 1})
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

    const decodedToken = jwt.verify(request.token, process.env.SECRET)    
    
    if(!request.token || !decodedToken.id){
      return response.status(401).json({error: 'token missing or invalid'})
    }
    
    const user = await User.findById(decodedToken.id)    
    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
      comments: []
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
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET) 
    if(!request.token || !decodedToken.id){
      return response.status(401).json({error: 'token missing or invalid'})
    }

    const blogToDelete = await Blog.findById(request.params.id)
    if(!blogToDelete){
      return response.status(404).json({error: 'Blog not found'})
    }
    
    if(blogToDelete.user.toString() === decodedToken.id.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(200).end()
    } else {
      response.status(403).json({error: 'Access denied'})
    }
    
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