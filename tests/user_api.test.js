const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const api = supertest(app)



beforeEach(async () => {
    const initialUsers = [{
        username: 'root',
        name: 'superuser',
        passwordHash: await bcrypt.hash('topSecret', 10)
    },
    {
        username: 'user',
        name: 'normaluser',
        passwordHash: await bcrypt.hash('kissa123', 10)
    }]

    await User.deleteMany({})
  
    let userObject = new User(initialUsers[0])
    await userObject.save()
  
    userObject = new User(initialUsers[1])
    await userObject.save()
  })

  describe('POST /api/users/', () => {
      test('adding new user works', async () => {
        const newUser = {
            username: 'batman',
            name: 'Bruce Wayne',
            password: await bcrypt.hash('catWoman', 10),
          }
          const result = await api.post('/api/users').send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })
  })

  afterAll(() => {
    mongoose.connection.close()
  })