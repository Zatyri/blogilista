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
  
module.exports = {
dummy,
totalLikes,
favoriteBlog
}