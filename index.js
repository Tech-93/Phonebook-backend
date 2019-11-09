const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')




morgan.token('type', function(req,res){ return[JSON.stringify(req.body)]})
app.use(morgan(':method :status :res[content-length] - :response-time ms :type'))

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())




app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const time = new Date().toUTCString()
  Person.find({}).then(persons => {
    res.send('<div> Phonebook has ' + persons.length + ' people <div/>' + '<div>' + time +  '<div/>')
  })
})




app.post('/api/persons', (request, response, next) => {
  const body = request.body


  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name/number missing'
    })
  } else{
    const person = new Person({
      name:body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
      .catch(error => next(error))

  }
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(body.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})





const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})