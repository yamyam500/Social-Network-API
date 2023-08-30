const { User, Thought } = require('../models');

module.exports = {

  // FIND ALL USERS
  async getUsers(req, res) {
    try {
      const users = await User
        .find()
        .populate('friends')
      res.json(users);
    } catch (err) {
      res.status(500).json(err)
      console.log(err)
    }
  },

  // GET A USER
  async getUser(req, res) {
    try {
      const user = await User
        .findOne({ _id: req.params.userId })
        .populate('friends')
        .select("-__v")

      if (!user) {
        return res.status(404).json({message: 'No user with that id'})
      }

      res.json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // CREATE A USER
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // UPDATE A USER
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId},
        { $set: req.body },
        { new: true }
      )

      if (!user) {
        return res.status(404).json({ message: 'No user with that id'});
      }

      res.json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // DELETE A USER
  async deleteUser(req, res) {
    try {
      const user = await User.findOne()

      if (!user) {
        return res.status(404).json({message: 'No user with that id'})
      }

      // delete thoughts 
      const thoughtsArr = user.thoughts.map(thought => thought.toString())
      console.log(thoughtsArr)
      thoughtsArr.forEach(async function (thoughtId) { 
        await Thought.findOneAndDelete({ _id: thoughtId}) 
      })

      await User.findOneAndDelete({ _id: user._id});

      res.json({message: `${user.username} has been deleted`})
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // ADD A FRIEND TO A USER
  async addFriend(req, res) {
    try {
     
      const newFriend = await User.findOne({ _id: req.params.friendId })
      if (!newFriend) {
        return res.status(404).json({ message: 'The friend you are trying to add does not exist' })
      }

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId},
        { $push: { friends: req.params.friendId}});

      if (!user) {
        return res.status(404).json({ message: 'No user with that id' })
      }

      res.json({ message: `${newFriend.username} has been added as ${user.username}'s friend`})
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // REMOVE A FRIEND FROM A USER
  async removeFriend(req, res) {
    try {
     
      const oldFriend = await User.findOne({ _id: req.params.friendId })
      if (!oldFriend) {
        return res.status(404).json({ message: 'The friend you are trying to remove does not exist' })
      }

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId},
        { $pull: { friends: req.params.friendId}});

      if (!user) {
        return res.status(404).json({ message: 'No user with that id' })
      }

      res.json({ message: `${oldFriend.username} has been removed from ${user.username}'s friends`})
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}