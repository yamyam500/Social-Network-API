const { Thought } = require('../models');
const { User } = require('../models');

module.exports = {

  // GET ALL THOUGHTS
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought
        .find()
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err)
      console.log(err)
    }
  },

  // GET A THOUGHT
  async getThought(req, res) {
    try {
      const thought = await Thought
        .findOne({ _id: req.params.id })

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json(thought)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // CREATE A THOUGHT
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId},
        { $push: { thoughts: thought._id}}
      )
      res.json(thought)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // UPDATE A THOUGHT
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id},
        { $set: req.body },
        { new: true }
      )

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that id'});
      }

      res.json(thought)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // UPDATE A THOUGHT
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id});

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json({message: `${thought.username}'s thought has been deleted`})
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // ADD A REACTION
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $push: { reactions: req.body}}
      )

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json(req.body)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
  },

  // DELETE A REACTION
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: req.params.reactionId}}
      )

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json({ message: 'The reaction has been removed'})
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
  }
}