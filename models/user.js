const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {type: String, require: true, unique: true, minLength: 4},
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

  userSchema.plugin(uniqueValidator)
  
  const User = mongoose.model('User', userSchema)
  
  module.exports = User