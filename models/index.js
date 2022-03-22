const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mernAuthLesson'

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.once('open', () => {
    console.log(`connect to mongo @ ${db.host}:${db.port}`)
})

db.on('error', (err) => {
    // console.log(`database error: ${err}`)
    console.log('the data center has burned down 🔥')
    console.log(err)
})

module.exports.User = require('./user')