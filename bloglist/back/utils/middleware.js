const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('----')
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message})
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorizationHeader = request.get('authorization')

  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    request.token = authorizationHeader.substring(7)
  }

  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor
}