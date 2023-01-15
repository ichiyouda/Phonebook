console.log("hello express");

const express = require('express')
const app = express()

const morgan = require('morgan')

morgan.token('postBody', req => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return ''
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/info', (req, res) => {
    const info = `
        <p>Phonebook has info for ${persons.length} people </p>
        <p> ${new Date()}</p>`
    res.send(info)
})


app.get('/api/persons/:id', (req, res) => {
    const theOne = persons.find(p => p.id === Number(req.params.id))
    if (theOne) {
        res.json(theOne)
    } else {
        res.status(404).send('404')
    }
})


app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req.params.id))
    res.status(204).end()
})

app.use(express.json())
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        res.status(404).json({ error: 'name or number is missing' })
    } else {
        const cretedP = persons.find(p => p.name === body.name)
        if (cretedP) {
            res.status(201).json({ error: 'name must be unique.'})
        } else {
            newPerson = {
                "id": Math.random() * 1000,
                "name": body.name,
                "number": body.number
            }
            persons = persons.concat(newPerson)
            res.json(newPerson)
        }
    }
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    
})