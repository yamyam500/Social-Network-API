const connection = require('../config/connection');
const users = require("./user.json")
const thoughts = require("./thoughts.json")
const reactions = require("./reactions.json")

const { User, Thought, Reaction } = require("../models")

function getRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomReactions(){
  const thoughtReactions = []
  for(let i = 0; i <=4; i++ ){
    const randomReactIdx =  getRandom(0, reactions.length - 1)
    thoughtReactions.push(reactions[randomReactIdx])
  }
  return thoughtReactions
} 

function getRandomThoughts(){
  const userThoughts = []
  for(let i = 0; i <=4; i++ ){
    const randomThoughtIdx =  getRandom(0, thoughts.length - 1)
    userThoughts.push(thoughts[randomThoughtIdx]._id)
  }
  return userThoughts
}

function getRandomUsers(){
  const friends = []
  for(let i = 0; i <=4; i++ ){
    const randomFriendIdx =  getRandom(0, users.length - 1)
    friends.push(users[randomFriendIdx]._id)
  }
  return friends
}

// generate random reactions for each thought
function buildFinalThoughts(){
  const finalThoughts = thoughts.map( thought => {
    // get 5 random reactions
    return {
      ...thought,
      reactions: getRandomReactions()
    }
  })
  return finalThoughts
}

// Get a random thought for a user
function buildFinalUsers(){
  const finalUsers = users.map( user => {
    // get 5 random thought ids
    return {
      ...user,
      thoughts: getRandomThoughts(),
      friends: getRandomUsers()
    }
  })
  return finalUsers
}

connection.once('open', async () => {
  let users = await connection.db.listCollections({ name: 'users' }).toArray();
  if (users.length) await connection.dropCollection('users');

  let thoughts = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughts.length) await connection.dropCollection('thoughts');

  const newThoughts = buildFinalThoughts()
  const newUsers = buildFinalUsers()

  try {
    await User.insertMany(newUsers)
  } catch (err) {
    throw new Error(err) 
  }

  try {
    await Thought.insertMany(newThoughts)
  } catch (err) {
    throw new Error(err) 
  }

  console.log("seeding complete")
  process.exit(0);
})