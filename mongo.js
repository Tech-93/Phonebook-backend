const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password, and a name and a number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://FullPhoneDB:${password}@cluster0-cvyqw.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {

  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()

  })


} else {

  const person = new Person({
    name: personName,
    number: personNumber
  })

  person.save().then(response => {
    console.log('added ' + personName + ' number ' + personNumber + ' to phonebook')
    mongoose.connection.close()
  })

}