require('./models')
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// middlewares - middleware is just a function
app.use(cors())
app.use(express.json()) // now we can use json request bodies

// next is the function that is
const myMiddleWare = (req, res, next) => {
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // need the next() function or else postman will just hang when the get route is called
    next()
}

// app.use(myMiddleWare)

// the way express works, when we define a route, 
// it accepts an arbitrary amount of middlewares and applies them to the routes
// when we declare app.use(myMiddleWare) outside, it gets used every time for every route.
// however, if we use myMiddleWare inside the route, it will only be used on that specific route
// app.get('/', myMiddleWare, (req,res) => {
app.get('/', (req,res) => {
    res.json({ msg: 'welcome to the user app 👋' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users'))

app.listen(PORT, () => console.log(`listening to the smooth sounds of port ${PORT} in the morning 🌊`))
