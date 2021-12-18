const express = require('express');
const bodyParser = require ('body-parser');
const { engine }  = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();


// View engine setup 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");


// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('contact')
});

const port = 3000;
app.listen(port, () => console.log(`Server start at ${port}`))