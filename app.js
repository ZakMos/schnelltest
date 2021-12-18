if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

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

app.post('/send', (req, res) => {
    const output = `
        <p> You have a new contact request </p>
        <h3> Contact Details</h3>
        <ul>
            <li>Vorname: ${req.body.fname}</li>
            <li>Nachname: ${req.body.lname}</li>
            <li>E-Mail: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message
            ${req.body.message}
        </h3>
    `;

    let transporter = nodemailer.createTransport({
      host: process.env.HOST_NAME,
      port: process.env.HOST_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER_NAME, 
        pass: process.env.USER_AUTH, 
      },
    //   tls:{
    //     rejectUnauthorized:false       // only in localhost
    //   }
    });
  
    // send mail with defined transport object
    let mailOptions = {
      from: "Schnelltest " + process.env.EMAIL_NAME, // sender address
      to: `${req.body.email}`, // list of receivers
      bcc: process.env.EMAIL_NAME,
      subject: `Hello ${req.body.fname}  ${req.body.lname} ✔`, // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mesage sent: %s', info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg: 'Email has been sent'})
    })
})


const port = 3000;
app.listen(port, () => console.log(`Server start at ${port}`))