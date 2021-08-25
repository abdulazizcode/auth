require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded
app.set(express.static('public'));
app.set('view engine', 'ejs');

//    Connecting to MongoDB
mongoose
    .connect('mongodb://localhost:27017/userDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('MongoDB Error');
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//encrypt password
userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ['password']
});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //Comparing if the inputed data matches with data which we have in our DB
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            //if user found then check the password if its matches
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
});
//    Listening to port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
