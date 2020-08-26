const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {type: String, require: true, minLength: 4},
    name: {type: String, require: true, minLength: 5},
    passwordHash: {type: String, require: true, minLength: 8}
  })
  
  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v      
      delete returnedObject.passwordHash
    }
  })
  
  const User = mongoose.model('User', userSchema)
  
  module.exports = User