require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const getMorgan = morgan('tiny')

app.get('/api/persons', getMorgan, (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', getMorgan, (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.find({})
    .then((result) => {
      response.send(
        `
        <p>Phonebook has info for ${result.length} persons</p>
        <p>${date}</p>
        `
      )
    })
    .catch((error) => next(error))
})

const postMorgan = morgan(
  ':method :url :status :res[content-length] - :response-time ms :request-body'
)

morgan.token('request-body', (req) => {
  return JSON.stringify(req.body)
})

app.post('/api/persons', postMorgan, (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      Error: 'Name cannot be empty!',
    })
  } else if (!body.number) {
    return response.status(400).json({
      Error: 'Number cannot be empty!',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint!' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

