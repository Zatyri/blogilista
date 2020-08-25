const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
  .then(blogs => {
      response.json(blogs)
    })
    
})


blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  await blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter