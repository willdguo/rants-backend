const mongoose = require('mongoose')

const rantSchema = new mongoose.Schema({
  content: String,
  date: Date,
  user: String,
  likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  ],
  saves: Number,
  /*
  comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
  ]
  */

})

rantSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Rant', rantSchema)