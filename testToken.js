const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtTest = async () => {
    try {
        // simulate a server response when a user is logged in
        // create a jwt payload
        const payload = {
            name: 'hi im a user',
            id: 'jasdf234asdf',
            // password???? -- NO. This is no place for a user's password
            // any other public user data can go here
            email: 'email@domain.com'
        }
        // sign the jwt token - sign is one method included in the jsonwebtoken package
        // const secret = 'my secret that the token is signed with, this is like a password' // store this secret string in your .env
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: (60 * 60) * 24 }) // expires in (in minutes) - is how long the token is good for
        console.log(token)
        // decode the jwt
        const decode = jwt.verify(token, process.env.JWT_SECRET) // will make sure that the secret in the jwt is the same as our servers
        console.log(decode)
    } catch (err) {
        console.log(err)
    }
}

jwtTest()