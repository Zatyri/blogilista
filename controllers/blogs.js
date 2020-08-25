const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/',  (request, response) => {
  Blog.find({}).then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
    .catch(error => {
        logger.error(error)
    })
})

blogsRouter.get('/:id',  (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if(blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
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