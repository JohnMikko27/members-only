console.log('This populates the db with dummy content')

const User = require('./models/user')
const Message = require('./models/message')
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.set("strictQuery", false);
const MONGODB_URI = process.env.MONGODB_URI
const mongoDB = MONGODB_URI

const users = []

main().catch((err) => console.log(err));
async function main() {
  console.log('main function called')
  await mongoose.connect(mongoDB);
  await createUsers()
  await createMessages()
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(firstName, lastName, username, password, membershipStatus, isAdmin) {
    const user = new User({ firstName: firstName, lastName: lastName, username: username, password: password, membershipStatus: membershipStatus, isAdmin: isAdmin })
    await user.save()
    users.push(user)
    console.log(`Added ${firstName} ${lastName} with username ${username} to the database`)
}

async function messageCreate(title, text, user) {
    const message = new Message({ title: title, text: text, user: user })
    await message.save()
    console.log(`Added message ${message} by ${user}`)
}

async function createUsers() {
    console.log('Adding users...')
    await Promise.all([
        userCreate('John Mikko', 'Velasquez', 'johnmiks27', 'pw', 'true', 'true'),
        userCreate('fakefirst', 'fakelast', 'fake', 'fake', 'true', 'false'),
    ])
}

async function createMessages() {
    console.log('Adding messages...')
    await Promise.all([
        messageCreate('boston v celtics',  'boston please beat mavs', users[0]),
        messageCreate('boutta poop',  'drank some protein shake', users[1]),
    ])
}