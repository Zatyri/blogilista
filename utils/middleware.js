const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {  
  const auth = request.get('authorization')    
  if(auth && auth.toLowerCase().startsWith('bearer ')){
    request.token = auth.substring(7)
  }
next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  next()
}


module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor }