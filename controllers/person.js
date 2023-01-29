const personRouter = require('express').Router()
const Person = require('../models/person')


/* get all persons */
personRouter.get('/', (req, res) => {
  Person.find({})
    .then(returnedP => {
      res.json(returnedP)
    })
})


/* get specified person */
personRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        console.log(`person ${person}`)
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


/* delete specified person */
personRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})


/* add new person */
personRouter.post('/', (req, res, next) => {
  const body = req.body
  Person.find({ name: body.name })
    .then(returnedP => {
      if (returnedP.name) {
        res.status(201).json({ error: 'name must be unique.' })
      } else {
        new Person(body).save()
          .then(savedOne => {
            console.log(`savedOne ${savedOne}`)
            res.json(savedOne)
          })
          .catch(err => next(err))
      }
    })
})


/* update a person */
personRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { runValidators: true, context: 'query', new: true }
  )
    .then(updatedP => {
      res.json(updatedP)
    })
    .catch(error => next(error))
})

module.exports = personRouter