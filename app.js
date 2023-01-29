const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const personRouter = require('./controllers/person')
const Person = require('./models/person')
const cors = require('cors')
const middleware = require('./utils/middleware')


const url = config.MONGO_URI
mongoose.set('strictQuery', false)
console.log('connecting to mongoDB...')
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(middleware.requestLogger)

/* info */
app.get('/info', (_req, res) => {
  Person.find({})
    .then(returnedP => {
      const info = `
                <p>Phonebook has info for ${returnedP.length} people </p>
                <p> ${new Date()}</p>`
      res.send(info)
    })
})

app.use('/api/persons', personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app