const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    console.log('get is running');
    
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => {
          logger.error(error)
      })
  })
  
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => {
          logger.error(error)
      })
  })

  module.exports = blogsRouter