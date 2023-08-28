const { Schema, model, ObjectId, Mongoose } = require('mongoose');

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
    required: true
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
  toJSON: {
    getters: true,
  },
  id: false,
}
)

reactionSchema
    .virtual('creationDate')
    .get(function () {
      return this.createdAt.toDateString()
    })

const Reaction = model('Reaction', reactionSchema)

module.exports = {Reaction, reactionSchema};