const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')


mongoose.set('useFindAndModify', false)


const url = 'mongodb+srv://FullPhoneDB:regendrop93@cluster0-cvyqw.mongodb.net/test?retryWrites=true&w=majority'

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, minlength: 3 },
    number: {type: String, required: true, minlength: 8}
  })

  personSchema.plugin(uniqueValidator)

  personSchema.set('toJSON',{
    transform: (document, returnObject) => {
      returnObject.id = returnObject._id.toString()
      delete returnObject._id
      delete returnObject.__v
      
    }
  })

  module.exports = mongoose.model('Person', personSchema)

