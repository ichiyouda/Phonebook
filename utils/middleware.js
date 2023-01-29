const morgan = require('morgan')
morgan.token('postBody', req => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postBody')


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


module.exports = { requestLogger, unknownEndpoint, errorHandler }
