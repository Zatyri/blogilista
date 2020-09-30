const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const logger = require('../utils/logger')
const Blog = require('../models/blog')

commentsRouter.get('/', async (request, response) => {
    try {
        const comments = await Comment.find({}).populate('blogId', {title: 1})
        response.json(comments.map(comment => comment.toJSON()))
        
    } catch (error) {
        logger.error(error)
    }

    commentsRouter.post('/', async (request, response) => {
        const body = request.body  
       
        
        try {

            const blog = await Blog.findById(body.blogId)

            const comment = new Comment({
                comment: body.comment,
                blogId: body.blogId
            })
            
            const saveComment = await comment.save()
            blog.comments = blog.comments.concat(saveComment._id)
            await blog.save()

            response.json(saveComment.toJSON())

        } catch (error) {

            logger.error(error)
        }
    })
})

module.exports = commentsRouter