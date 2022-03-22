const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../models')
const requiresToken = require('../requiresToken')

// POST /users/register -- CREATE a new user
router.post('/register', async (req,res) => {
    try {
        // check if the user exists already -- if they do, then don't allow them to sign up again
        const userCheck = await db.User.findOne({
            email: req.body.email
        })
        if (userCheck) return res.status(409).json({ msg: 'did you forget that you already signed up with that email? 🤔' })

        // hash the password (could validate if we wanted - like if we wanted more than a 1 character password) - 12 salts is industry standard
        const salt = 12
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // create a user in the db
        const newUser = await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // create a jwt paylowd to send back to the client
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
            // id: newUser._id -- either one works. jsonify is ._id. in the front end it needs to be ._id
        }

        // sign the jwt and send it (log them in)
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        res.json({ token })

    } catch (err) {
        console.log(err)
        res.status(503).json({ msg: 'oops server error 503 🔥😭' })
    }
})

// POST /user/login -- validate login credentials
router.post('/login', async (req, res) => {
    try {
        // try to find the user in the db that is logging in
        const foundUser = await db.User.findOne({
            email: req.body.email
        })
        // if the user is not found -- return and send back a message that the user needs to sign up
        if (!foundUser) return res.status(400).json({ msg: 'bad login credentials' })

        // check the password from the req.body against the password in the db
        const comparePasswords = await bcrypt.compare(req.body.password, foundUser.password)
        console.log(comparePasswords)
        // equivalent to but compareSync doesn't return a promise
        // if (!bcrypt.compareSync(req.body.password, foundUser.password))
        // return res.status(401).json({ msg: 'invalid password'})

        // if the provided info does not match -- send back an error message and return
        if (!comparePasswords) {
            return res.status(409).json({ msg: 'bad login credentials' })
        }

        // if the user is logging in, create a jwt payload
        const payload = {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser.id
        }

        // sign the jwt
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        // send it back
        res.json({ token })

    } catch (err) {
        console.log(err)
        res.status(503).json({ msg: 'oops server error 503 🔥😭' })
    }
})

// GET /users/auth-locked -- example of checking a jwt and not serving data unless the jwt is valid
router.get('/auth-locked', requiresToken, (req, res) => {
    // res.send('validate a token')
    // here we have access to the user on the res.locals
    // don't need to do /auth-locked/:id ever because we have access to the user id all the time now
    console.log('logged in user', res.locals.user)
    res.json({ msg: 'welcome to the auth locked route, congrats on getting through the midddleware' })
})

module.exports = router