const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded
app.set(express.static('public'));
app.set('view engine', 'ejs');

//    Connecting to MongoDB
mongoose
    .connect('mongodb://localhost:27017/wikiDb', {
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

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});
//    Listening to port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
