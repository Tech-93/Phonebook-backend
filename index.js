const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


morgan.token('type', function(req,res){ return[JSON.stringify(req.body)]})
app.use(morgan(':method :status :res[content-length] - :response-time ms :type'))

app.use(bodyParser.json())
app.use(cors())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: 'Simon',
    number: '123456',
    id: 5
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (req, res) => {
  const time = new Date().toUTCString()
  res.send('<div> Phonebook has ' + persons.length + ' people <div/>' + '<div>' + time +  '<div/>' )
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  var names = persons.map((person) => person.name.toLocaleLowerCase())

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name/number missing' 
    })
  } else if(names.includes(body.name.toLocaleLowerCase())){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  } else{

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)}
})



const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)