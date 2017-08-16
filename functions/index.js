const functions = require('firebase-functions');

const express = require('express');
const bodyParser = require('body-parser');


const mailModule = require('./private_modules/mail.js');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/testOnline', (request, response) => {
  response.send(`<h3>Test Online</h3><p>El momento actual es: ${Date.now()}</p>`);
});

// POST http://localhost:8080/users
// parameters sent with 
app.post('/blogcontact', mailModule.sendContactMail);

exports.webapp = functions.https.onRequest(app);
