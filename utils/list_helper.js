const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (total, currentValue) => total + currentValue
    if(blogs.length === 0){
        return 0
    } else if(blogs.length === 1){
        return blogs[0].likes
    } else {        
        return blogs.map(blog => blog.likes).reduce(reducer)
    }
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return 0
    } else if(blogs.length === 1){
        return blogs[0]
    } else {
        return blogs.reduce((prev, current) => (prev.likes > current.likes)?prev:current)
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return 0
    } else if(blogs.length === 1){
        const newBlog = {
            author: blogs[0].author,
            blogs: 1
        }    
        return newBlog
    } else {
        const authors = blogs.map(blog => blog.author)
        const uniqueAuthorsSet = new Set(authors)
        const uniqueAuthors = [...uniqueAuthorsSet]
        const authorsBlogCount = []
        uniqueAuthors.forEach(author => {
            const blogCount = authors.filter(x => x === author).length       
            const authorToAdd = [{author: author, blogs: blogCount}]
            authorsBlogCount.push(authorToAdd)
        })
        return authorsBlogCount.reduce((prev, current) => (prev.blogs > current.blogs)?prev:current)
    }
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return 0
    } else if(blogs.length === 1){
        const newBlog = {
            author: blogs[0].author,
            likes: blogs[0].likes
        }    
        return newBlog
    } else {
        const authors = blogs.map(blog => blog.author)
        const uniqueAuthorsSet = new Set(authors)
        const uniqueAuthors = [...uniqueAuthorsSet]
        const authorsLikes = []
        uniqueAuthors.forEach(author => {
            const authorsBlogs = blogs.filter(x => x.author === author)
            let totLikes = 0
            authorsBlogs.forEach(post => {
                totLikes = totLikes + post.likes
            })
            const newInput = {author: author, likes: totLikes}
            authorsLikes.push(newInput)
        })
        return authorsLikes.reduce((prev, current) => (prev.likes > current.likes)?prev:current)
    }
}

  
module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes
}