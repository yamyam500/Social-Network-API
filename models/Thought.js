const { Schema, model } = require('mongoose');
const { reactionSchema } = require('./Reaction')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () { 
    return this.reactions.length })

thoughtSchema
    .virtual('creationDate')
    .get(function () {
      return this.createdAt.toDateString()
    })

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;