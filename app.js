require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')


mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// const secret = 'ThisisourLittlesecret'
userSchema.plugin(encrypt, { secret: process.env.MY_SECRET, encryptedFields: ['password'] })

const User = new mongoose.model('User', userSchema)

// console.log(process.env.API_KEY)

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(`${__dirname}/public`)))
app.use(bodyParser.urlencoded({ extended: true }))


// Home
app.get('/', (req, res) => {
    res.render('home')
})


// Register
app.get('/register', (req, res) => {
    res.render('register')
})


app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render('secrets')
        }
    })
})


// Login
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets')
                }
            }
        }
    })
})



app.listen(3000, () => {
    console.log('Server is listening on port 3000 🎅🎅🎅')
})